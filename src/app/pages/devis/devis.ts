import { Component } from '@angular/core';

/**
 * Static placeholder for the Devis / Factures screen.
 *
 * TODO(Task 5): devis list + editor (date, numero, proprietaire, vehicule,
 * documentType Devis/Facture, lignes FormArray with totals) - feature parity
 * with the legacy `my-devis-generator` form.
 * TODO(Task 6): server-side PDF via `GET /api/devis/{id}/pdf`.
 * TODO(Task 10): convert devis -> facture via `POST /api/devis/{id}/convert`.
 */
@Component({
    selector: 'app-devis',
    standalone: true,
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Devis / Factures</div>
            <p class="mb-4">Placeholder page - no data yet.</p>
            <ul class="leading-8">
                <li><span class="font-medium">TODO(Task 5):</span> devis CRUD with lignes (quantite, fourniture, prixUnitaire, prixTotal, isIncluded)</li>
                <li><span class="font-medium">TODO(Task 5):</span> document numbering <code>DEV-2026-001</code> / <code>FAC-2026-001</code></li>
                <li><span class="font-medium">TODO(Task 6):</span> download PDF (server-side, OpenPDF)</li>
                <li><span class="font-medium">TODO(Task 10):</span> convert a devis into a facture</li>
            </ul>
        </div>
    `
})
export class Devis {}
