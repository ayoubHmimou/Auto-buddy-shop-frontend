import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Client } from '../../core/api/client.model';
import { ClientApiService } from '../../core/api/clients-api.service';
import { DevisApiService } from '../../core/api/devis-api.service';
import { Devis, DevisRequest, DocumentType } from '../../core/api/devis.model';

interface LineForm {
    quantity: number;
    description: string;
    unitPrice: number | null;
    included: boolean;
}

interface VehicleOption {
    id: number;
    label: string;
}

@Component({
    selector: 'app-devis',
    standalone: true,
    imports: [
        CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule,
        DialogModule, ConfirmDialogModule, InputTextModule, InputNumberModule,
        SelectModule, DatePickerModule, CheckboxModule, TagModule, ToastModule
    ],
    templateUrl: './devis.html',
    styleUrls: ['./devis.scss'],
    providers: [MessageService, ConfirmationService]
})
export class DevisPage implements OnInit {

    private readonly api = inject(DevisApiService);
    private readonly clientsApi = inject(ClientApiService);
    private readonly messages = inject(MessageService);
    private readonly confirmation = inject(ConfirmationService);

    readonly documents = signal<Devis[]>([]);
    readonly loading = signal(false);

    readonly dialog = signal(false);
    readonly editingId = signal<number | null>(null);
    readonly editingNumber = signal<string | null>(null);
    readonly saving = signal(false);

    readonly documentType = signal<DocumentType>('DEVIS');
    readonly issueDate = signal<Date>(new Date());
    readonly clientId = signal<number | null>(null);
    readonly clientName = signal<string>('');
    readonly vehicleId = signal<number | null>(null);
    readonly vehicleLabel = signal<string | null>(null);
    readonly registration = signal<string | null>(null);

    readonly clients = signal<Client[]>([]);
    readonly lines = signal<LineForm[]>([]);

    readonly types = [
        { label: 'Devis', value: 'DEVIS' as DocumentType },
        { label: 'Facture', value: 'FACTURE' as DocumentType }
    ];

    readonly selectedClient = computed(() =>
        this.clients().find((c) => c.id === this.clientId()) ?? null);

    readonly vehicles = computed<VehicleOption[]>(() =>
        (this.selectedClient()?.vehicles ?? [])
            .map((v) => ({ id: v.id, label: `${v.make} ${v.model} (${v.registration})` })));

    readonly total = computed(() =>
        this.lines().reduce((sum, line) => sum + this.lineTotal(line), 0));

    ngOnInit(): void {
        this.load();
        this.clientsApi.list().subscribe({ next: (clients) => this.clients.set(clients) });
    }

    load(): void {
        this.loading.set(true);
        this.api.list().subscribe({
            next: (docs) => {
                this.documents.set(docs);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.toast('error', 'Erreur', 'Impossible de charger les documents');
            }
        });
    }

    // ── dialog ──

    openNew(): void {
        this.editingId.set(null);
        this.editingNumber.set(null);
        this.documentType.set('DEVIS');
        this.issueDate.set(new Date());
        this.clientId.set(null);
        this.clientName.set('');
        this.vehicleId.set(null);
        this.vehicleLabel.set(null);
        this.registration.set(null);
        this.lines.set([this.emptyLine()]);
        this.dialog.set(true);
    }

    openEdit(doc: Devis): void {
        this.editingId.set(doc.id);
        this.editingNumber.set(doc.number);
        this.documentType.set(doc.documentType);
        this.issueDate.set(this.parseIso(doc.issueDate));
        this.clientId.set(doc.clientId);
        this.clientName.set(doc.clientName);
        this.vehicleId.set(doc.vehicleId);
        this.vehicleLabel.set(doc.vehicleLabel);
        this.registration.set(doc.registration);
        this.lines.set(doc.lines.map((l) => ({
            quantity: l.quantity,
            description: l.description,
            unitPrice: l.unitPrice,
            included: l.included
        })));
        this.dialog.set(true);
    }

    onClientChange(clientId: number | null): void {
        this.clientId.set(clientId);
        this.clientName.set(this.clients().find((c) => c.id === clientId)?.name ?? '');
        this.vehicleId.set(null);
        this.vehicleLabel.set(null);
        this.registration.set(null);
    }

    onVehicleChange(vehicleId: number | null): void {
        const vehicle = this.selectedClient()?.vehicles.find((v) => v.id === vehicleId) ?? null;
        this.vehicleId.set(vehicleId);
        this.vehicleLabel.set(vehicle ? `${vehicle.make} ${vehicle.model}` : null);
        this.registration.set(vehicle?.registration ?? null);
    }

    // ── lines ──

    addLine(): void {
        this.lines.update((lines) => [...lines, this.emptyLine()]);
    }

    removeLine(index: number): void {
        this.lines.update((lines) => lines.filter((_, i) => i !== index));
    }

    updateLine(index: number, field: keyof LineForm, value: unknown): void {
        this.lines.update((lines) =>
            lines.map((line, i) => (i === index ? { ...line, [field]: value } : line)));
    }

    lineTotal(line: LineForm): number {
        if (line.included || line.unitPrice === null) {
            return 0;
        }
        return line.quantity * line.unitPrice;
    }

    // ── save / delete / convert ──

    save(): void {
        if (!this.clientId()) {
            this.toast('warn', 'Champs requis', 'Choisissez un client');
            return;
        }
        if (!this.lines().some((l) => l.description.trim())) {
            this.toast('warn', 'Champs requis', 'Ajoutez au moins une ligne');
            return;
        }

        const request: DevisRequest = {
            documentType: this.documentType(),
            issueDate: this.toIso(this.issueDate()),
            clientId: this.clientId(),
            clientName: this.clientName(),
            vehicleId: this.vehicleId(),
            vehicleLabel: this.vehicleLabel(),
            registration: this.registration(),
            lines: this.lines()
                .filter((l) => l.description.trim())
                .map((l) => ({
                    quantity: l.quantity,
                    description: l.description.trim(),
                    unitPrice: l.included ? null : l.unitPrice,
                    included: l.included
                }))
        };

        this.saving.set(true);
        const id = this.editingId();
        const request$ = id ? this.api.update(id, request) : this.api.create(request);

        request$.subscribe({
            next: () => {
                this.saving.set(false);
                this.dialog.set(false);
                this.load();
                this.toast('success', 'Enregistré', 'Document enregistré');
            },
            error: (err) => {
                this.saving.set(false);
                this.toast('error', 'Erreur', err?.error?.error ?? 'Enregistrement impossible');
            }
        });
    }

    convert(doc: Devis): void {
        this.confirmation.confirm({
            header: 'Convertir en facture',
            message: `Créer une facture à partir de ${doc.number} ?`,
            icon: 'pi pi-replay',
            acceptLabel: 'Convertir',
            rejectLabel: 'Annuler',
            accept: () => {
                this.api.convert(doc.id).subscribe({
                    next: (facture) => {
                        this.load();
                        this.toast('success', 'Facture créée', facture.number);
                    },
                    error: () => this.toast('error', 'Erreur', 'Conversion impossible')
                });
            }
        });
    }

    remove(doc: Devis): void {
        this.confirmation.confirm({
            header: 'Supprimer',
            message: `Supprimer ${doc.number} ?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Supprimer',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.api.delete(doc.id).subscribe({
                    next: () => {
                        this.load();
                        this.toast('success', 'Supprimé', 'Document supprimé');
                    },
                    error: () => this.toast('error', 'Erreur', 'Suppression impossible')
                });
            }
        });
    }

    downloadPdf(doc: Devis): void {
        this.api.downloadPdf(doc.id).subscribe({
            next: (blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${doc.number}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
            },
            error: () => this.toast('error', 'Erreur', 'Téléchargement impossible')
        });
    }

    // ── helpers ──

    money(value: number | null | undefined): string {
        if (value === null || value === undefined) {
            return '—';
        }
        return value.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' DH';
    }

    private emptyLine(): LineForm {
        return { quantity: 1, description: '', unitPrice: null, included: false };
    }

    // Local date -> ISO (never toISOString: it shifts to UTC and can change the day).
    private toIso(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    private parseIso(value: string): Date {
        const [y, m, d] = value.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    private toast(severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string): void {
        this.messages.add({ severity, summary, detail, life: 3000 });
    }

}

