import { Component } from '@angular/core';

/**
 * Static placeholder for the Settings screen (shop profile).
 *
 * TODO(Task 7): shop profile form (name / address / phone / logo) via
 * `GET/PUT /api/shop-profile` and `POST /api/shop-profile/logo` (multipart).
 * The profile is what the generated devis/facture PDF header reads.
 * TODO(Task 8): admin-only access once roles exist (USER + ADMIN).
 */
@Component({
    selector: 'app-settings',
    standalone: true,
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Settings</div>
            <p class="mb-4">Placeholder page - no data yet.</p>
            <ul class="leading-8">
                <li><span class="font-medium">TODO(Task 7):</span> shop profile (name, address, phone) shown on devis/facture documents</li>
                <li><span class="font-medium">TODO(Task 7):</span> logo upload (multipart, stored in the <code>/data/uploads</code> volume)</li>
                <li><span class="font-medium">TODO(Task 8):</span> ADMIN-only page</li>
            </ul>
        </div>
    `
})
export class Settings {}
