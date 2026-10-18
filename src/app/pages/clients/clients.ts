import { Component } from '@angular/core';

/**
 * Static placeholder for the Clients screen.
 *
 * TODO(Task 4): list/search/create clients and their vehicles via
 * `GET/POST /api/clients`, `GET/PUT/DELETE /api/clients/{id}` and the nested
 * vehicle endpoints (client-service, proxied by the gateway at environment.apiUrl).
 * TODO(Task 8): require an authenticated user before this page is reachable.
 */
@Component({
    selector: 'app-clients',
    standalone: true,
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Clients</div>
            <p class="mb-4">Placeholder page - no data yet.</p>
            <ul class="leading-8">
                <li><span class="font-medium">TODO(Task 4):</span> client list + search (name / phone / immatriculation)</li>
                <li><span class="font-medium">TODO(Task 4):</span> client form (create / edit / delete)</li>
                <li><span class="font-medium">TODO(Task 4):</span> nested vehicles per client (1-to-many)</li>
                <li><span class="font-medium">TODO(Task 8):</span> guard + HTTP interceptor so only logged-in users reach this page</li>
            </ul>
        </div>
    `
})
export class Clients {}
