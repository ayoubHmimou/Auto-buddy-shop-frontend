import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

/**
 * Skeleton menu - only the placeholder pages that exist in the skeleton.
 * Demo entries from the Sakai template (UI Kit, CRUD, Landing, Documentation,
 * Hierarchy) have been removed on purpose.
 */
@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Work',
                items: [
                    { label: 'Clients', icon: 'pi pi-fw pi-users', routerLink: ['/pages/clients'] },
                    { label: 'Devis', icon: 'pi pi-fw pi-file', routerLink: ['/pages/devis'] },
                    { label: 'Catalogue', icon: 'pi pi-fw pi-list', routerLink: ['/pages/catalogue'] }
                ]
            },
            {
                label: 'Configuration',
                items: [{ label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/pages/settings'] }]
            },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    { label: 'Login (placeholder)', icon: 'pi pi-fw pi-sign-in', routerLink: ['/auth/login'] },
                    { label: 'Error (placeholder)', icon: 'pi pi-fw pi-times-circle', routerLink: ['/auth/error'] },
                    { label: 'Access Denied (placeholder)', icon: 'pi pi-fw pi-lock', routerLink: ['/auth/access'] }
                ]
            }
        ];
    }
}
