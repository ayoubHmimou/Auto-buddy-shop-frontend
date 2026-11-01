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
    templateUrl: './devis.html'
})
export class Devis {}
