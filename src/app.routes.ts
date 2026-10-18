import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/pages/notfound/notfound';

/**
 * Skeleton routes: Sakai layout + static placeholder pages only.
 *
 * TODO(Task 8): add a real auth flow (login page wiring, AuthService,
 * HTTP interceptor, auth guard). The auth/* pages under pages/auth are
 * static placeholders until then - the "Sign In" button does nothing.
 */
export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
