import { Routes } from '@angular/router';
import { Catalogue } from './catalogue/catalogue';
import { Clients } from './clients/clients';
import { Devis } from './devis/devis';
import { Settings } from './settings/settings';

/**
 * Skeleton placeholder pages - one static "TODO Task N" page per menu entry.
 * All of them are plain components with TODO comments; no HTTP calls yet.
 */
export default [
    { path: 'clients', component: Clients },
    { path: 'devis', component: Devis },
    { path: 'catalogue', component: Catalogue },
    { path: 'settings', component: Settings },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
