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
    templateUrl: './settings.html'
})
export class Settings {}
