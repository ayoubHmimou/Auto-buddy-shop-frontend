import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ClientApiService } from '../../core/api/clients-api.service';
import { CatalogApiService } from '../../core/api/catalog-api.service';
import { VehicleMake, VehicleModel } from '../../core/api/catalog.model';
import { Client, ClientRequest, Vehicle, VehicleRequest } from '../../core/api/client.model';

@Component({
    selector: 'app-clients',
    standalone: true,
    imports: [
        CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule,
        DialogModule, ConfirmDialogModule, InputTextModule, InputNumberModule,
        SelectModule, TagModule, ToastModule
    ],
    templateUrl: './clients.html',
    styleUrls: ['./clients.scss'],
    providers: [MessageService, ConfirmationService]
})
export class Clients implements OnInit {

    private readonly api = inject(ClientApiService);
    private readonly catalog = inject(CatalogApiService);
    private readonly messages = inject(MessageService);
    private readonly confirmation = inject(ConfirmationService);

    readonly clients = signal<Client[]>([]);
    readonly loading = signal(false);
    readonly q = signal('');

    // ── client dialog ──
    readonly clientDialog = signal(false);
    readonly editingClientId = signal<number | null>(null);
    clientName = '';
    clientPhone = '';
    clientEmail = '';
    clientAddress = '';
    readonly savingClient = signal(false);

    // ── vehicles dialog ──
    readonly vehicleDialog = signal(false);
    readonly selectedClient = signal<Client | null>(null);
    readonly editingVehicleId = signal<number | null>(null);
    readonly makes = signal<VehicleMake[]>([]);
    readonly models = signal<VehicleModel[]>([]);
    readonly makeId = signal<number | null>(null);
    readonly modelId = signal<number | null>(null);
    readonly loadingModels = signal(false);
    vehicleRegistration = '';
    vehicleYear: number | null = null;
    readonly savingVehicle = signal(false);

    // ── add make / model ──
    readonly makeDialog = signal(false);
    readonly modelDialog = signal(false);
    newMakeName = '';
    newModelName = '';
    readonly savingCatalog = signal(false);

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.api.list(this.q() || undefined).subscribe({
            next: (data) => {
                this.clients.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.toast('error', 'Erreur', 'Impossible de charger les clients');
            }
        });
    }

    search(): void {
        this.load();
    }

    // ── client CRUD ──

    openNewClient(): void {
        this.editingClientId.set(null);
        this.resetClientForm();
        this.clientDialog.set(true);
    }

    openEditClient(client: Client): void {
        this.editingClientId.set(client.id);
        this.clientName = client.name;
        this.clientPhone = client.phone;
        this.clientEmail = client.email ?? '';
        this.clientAddress = client.address ?? '';
        this.clientDialog.set(true);
    }

    private resetClientForm(): void {
        this.clientName = '';
        this.clientPhone = '';
        this.clientEmail = '';
        this.clientAddress = '';
    }

    saveClient(): void {
        if (!this.clientName.trim() || !this.clientPhone.trim()) {
            this.toast('warn', 'Champs requis', 'Le nom et le téléphone sont obligatoires');
            return;
        }

        const body: ClientRequest = {
            name: this.clientName.trim(),
            phone: this.clientPhone.trim(),
            email: this.clientEmail.trim() || null,
            address: this.clientAddress.trim() || null
        };

        this.savingClient.set(true);
        const id = this.editingClientId();
        const isEdit = id !== null;
        const request$ = id ? this.api.update(id, body) : this.api.create(body);

        request$.subscribe({
            next: () => {
                this.savingClient.set(false);
                this.editingClientId.set(null);
                this.resetClientForm();

                // Edit -> close. Create -> stay open for the next client.
                if (isEdit) {
                    this.clientDialog.set(false);
                }

                this.load();
                this.toast('success', 'Enregistré', 'Client enregistré');
            },
            error: (err) => {
                this.savingClient.set(false);
                this.toast('error', 'Erreur', err?.error?.error ?? 'Enregistrement impossible');
            }
        });
    }

    deleteClient(client: Client): void {
        this.confirmation.confirm({
            header: 'Supprimer le client',
            message: `Supprimer ${client.name} et tous ses véhicules ?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Supprimer',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.api.delete(client.id).subscribe({
                    next: () => {
                        this.toast('success', 'Supprimé', 'Client supprimé');
                        this.load();
                    },
                    error: () => this.toast('error', 'Erreur', 'Suppression impossible')
                });
            }
        });
    }

    // ── vehicles ──

    openVehicles(client: Client): void {
        this.selectedClient.set(client);
        this.resetVehicleForm();
        this.loadMakes();
        this.vehicleDialog.set(true);
    }

    resetVehicleForm(): void {
        this.editingVehicleId.set(null);
        this.makeId.set(null);
        this.modelId.set(null);
        this.models.set([]);
        this.vehicleRegistration = '';
        this.vehicleYear = null;
    }

    loadMakes(): void {
        this.catalog.findMakes().subscribe({
            next: (makes) => this.makes.set(makes),
            error: () => this.toast('error', 'Erreur', 'Impossible de charger les marques')
        });
    }

    onMakeChange(makeId: number | null): void {
        this.makeId.set(makeId);
        this.modelId.set(null);
        this.models.set([]);

        if (!makeId) {
            return;
        }

        this.loadingModels.set(true);
        this.catalog.findModels(makeId).subscribe({
            next: (models) => {
                this.models.set(models);
                this.loadingModels.set(false);
            },
            error: () => {
                this.loadingModels.set(false);
                this.toast('error', 'Erreur', 'Impossible de charger les modèles');
            }
        });
    }

    editVehicle(vehicle: Vehicle): void {
        this.editingVehicleId.set(vehicle.id);
        this.vehicleRegistration = vehicle.registration;
        this.vehicleYear = vehicle.year;
        this.makeId.set(vehicle.makeId);
        this.modelId.set(vehicle.modelId);

        this.catalog.findModels(vehicle.makeId).subscribe({
            next: (models) => this.models.set(models)
        });
    }

    saveVehicle(): void {
        const client = this.selectedClient();
        const makeId = this.makeId();
        const modelId = this.modelId();

        if (!client) {
            return;
        }
        if (!makeId || !modelId) {
            this.toast('warn', 'Champs requis', 'Choisissez une marque et un modèle');
            return;
        }
        if (!this.vehicleRegistration.trim()) {
            this.toast('warn', 'Champs requis', "L'immatriculation est obligatoire");
            return;
        }

        const body: VehicleRequest = {
            registration: this.vehicleRegistration.trim(),
            modelId,
            year: this.vehicleYear
        };

        this.savingVehicle.set(true);
        const id = this.editingVehicleId();
        const request$ = id
            ? this.api.updateVehicle(client.id, id, body)
            : this.api.addVehicle(client.id, body);

        request$.subscribe({
            next: () => {
                this.savingVehicle.set(false);
                this.resetVehicleForm();
                this.refreshSelectedClient(client.id);
                this.load();
                this.toast('success', 'Enregistré', 'Véhicule enregistré');
            },
            error: (err) => {
                this.savingVehicle.set(false);
                this.toast('error', 'Erreur', err?.error?.error ?? 'Enregistrement impossible');
            }
        });
    }

    deleteVehicle(vehicle: Vehicle): void {
        const client = this.selectedClient();
        if (!client) {
            return;
        }

        this.confirmation.confirm({
            header: 'Supprimer le véhicule',
            message: `Supprimer le véhicule ${vehicle.registration} ?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Supprimer',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.api.deleteVehicle(client.id, vehicle.id).subscribe({
                    next: () => {
                        this.refreshSelectedClient(client.id);
                        this.load();
                        this.toast('success', 'Supprimé', 'Véhicule supprimé');
                    },
                    error: () => this.toast('error', 'Erreur', 'Suppression impossible')
                });
            }
        });
    }

    private refreshSelectedClient(id: number): void {
        this.api.get(id).subscribe({
            next: (client) => this.selectedClient.set(client)
        });
    }

    // ── catalog additions ──

    openMakeDialog(): void {
        this.newMakeName = '';
        this.makeDialog.set(true);
    }

    saveMake(): void {
        const name = this.newMakeName.trim();
        if (!name) {
            return;
        }

        this.savingCatalog.set(true);
        this.catalog.createMake(name).subscribe({
            next: (make) => {
                this.savingCatalog.set(false);
                this.makeDialog.set(false);
                this.loadMakes();
                this.onMakeChange(make.id);
                this.toast('success', 'Marque ajoutée', make.name);
            },
            error: () => {
                this.savingCatalog.set(false);
                this.toast('error', 'Erreur', 'Ajout impossible');
            }
        });
    }

    openModelDialog(): void {
        if (!this.makeId()) {
            this.toast('warn', 'Marque requise', "Choisissez d'abord une marque");
            return;
        }
        this.newModelName = '';
        this.modelDialog.set(true);
    }

    saveModel(): void {
        const makeId = this.makeId();
        const name = this.newModelName.trim();
        if (!makeId || !name) {
            return;
        }

        this.savingCatalog.set(true);
        this.catalog.createModel(makeId, name).subscribe({
            next: (model) => {
                this.savingCatalog.set(false);
                this.modelDialog.set(false);
                this.catalog.findModels(makeId).subscribe((models) => this.models.set(models));
                this.modelId.set(model.id);
                this.toast('success', 'Modèle ajouté', model.name);
            },
            error: () => {
                this.savingCatalog.set(false);
                this.toast('error', 'Erreur', 'Ajout impossible');
            }
        });
    }

    private toast(severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string): void {
        this.messages.add({ severity, summary, detail, life: 3000 });
    }
}
