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
    templateUrl: './clients.html'
})
export class Clients {}
