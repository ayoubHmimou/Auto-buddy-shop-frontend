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
    templateUrl: './dashboard.html'
})
export class Dashboard {
    readonly apiUrl = environment.apiUrl;
}
