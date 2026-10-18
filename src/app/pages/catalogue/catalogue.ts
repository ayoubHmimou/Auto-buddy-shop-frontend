import { Component } from '@angular/core';

/**
 * Static placeholder for the prestations catalogue screen.
 *
 * TODO(Task 5): CRUD for `GET/POST/PUT/DELETE /api/prestations` - the catalogue
 * that feeds the devis-line autocomplete and replaces the legacy "frequency hack".
 */
@Component({
    selector: 'app-catalogue',
    standalone: true,
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Catalogue des prestations</div>
            <p class="mb-4">Placeholder page - no data yet.</p>
            <ul class="leading-8">
                <li><span class="font-medium">TODO(Task 5):</span> prestation list + search (feeds devis-line autocomplete)</li>
                <li><span class="font-medium">TODO(Task 5):</span> create / edit / delete prestations</li>
            </ul>
        </div>
    `
})
export class Catalogue {}
