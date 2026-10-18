import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Static skeleton dashboard.
 *
 * TODO(Task 8): once the auth flow exists, guard this page and show
 * user-specific data. TODO(Tasks 4-5): replace the placeholders below with
 * real stats fetched from client-service / devis-service through the gateway.
 */
@Component({
    selector: 'app-dashboard',
    standalone: true,
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Devis Platform - Skeleton</div>
            <p class="mb-4">
                Infrastructure only. Every service boots, registers with Eureka and is reachable through the gateway, but no
                application endpoints exist yet - all of them are your coding tasks (see README roadmap).
            </p>
            <ul class="leading-8">
                <li><span class="font-medium">API base URL:</span> {{ apiUrl }}</li>
                <li><span class="font-medium">Auth:</span> TODO(Task 1) login + JWT issuing, TODO(Task 2/3) JWT validation</li>
                <li><span class="font-medium">Clients:</span> TODO(Task 4) Client/Vehicle CRUD</li>
                <li><span class="font-medium">Devis:</span> TODO(Task 5) domain + DEV/FAC numbering, TODO(Task 6) PDF</li>
                <li><span class="font-medium">Frontend:</span> TODO(Task 8) AuthService + interceptor + guard</li>
            </ul>
        </div>
    `
})
export class Dashboard {
    readonly apiUrl = environment.apiUrl;
}
