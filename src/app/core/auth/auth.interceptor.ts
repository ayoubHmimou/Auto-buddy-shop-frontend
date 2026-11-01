import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const token = auth.getToken();

    const isAuthCall = req.url.includes('/api/auth/login')
        || req.url.includes('/api/auth/register')
        || req.url.includes('/api/auth/refresh');

    if (!token || isAuthCall) {
        return next(req);
    }

    return next(req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
    }));
};
