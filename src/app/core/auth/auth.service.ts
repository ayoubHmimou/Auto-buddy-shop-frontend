import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AuthResponse, CurrentUser } from "./auth.model";
import { Observable, tap } from "rxjs";
import { environment } from "@/environments/environment";


const TOKEN_KEY = 'scan2plan.accessToken';
const REFRESH_KEY = 'scan2plan.refreshToken';
const USER_KEY = 'scan2plan.user';

@Injectable({ providedIn: 'root'})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly apiUrl =  `${environment.apiUrl}/api/auth`;

    readonly token = signal<string | null>(this.read(TOKEN_KEY));
    readonly user = signal<CurrentUser | null>(this.readUser());
    readonly isAuthenticated = computed(() => !!this.token());

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap((response) => {
                this.setSession(response);
                // Do NOT block the redirect on /me: load the profile in the
                // background so login feels instant. The topbar updates via the
                // signal once it arrives.
                this.loadMe().subscribe({ error: () => { /* token invalid -> guard handles it */ } });
            })
        );
    }

    loadMe(): Observable<CurrentUser> {
        return this.http.get<CurrentUser>(`${this.apiUrl}/me`).pipe(
            tap((user) => {
                this.user.set(user);
                localStorage.setItem(USER_KEY, JSON.stringify(user));
            })
        );
    }

    getToken(): string | null {
        return this.token();
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
        this.token.set(null);
        this.user.set(null);
        this.router.navigate(['/auth/login']);
    }

    private setSession(response: AuthResponse): void {
        localStorage.setItem(TOKEN_KEY, response.accessToken);
        localStorage.setItem(REFRESH_KEY, response.refreshToken);
        this.token.set(response.accessToken);
    }

    private read(key: string): string | null {
        return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    }

    private readUser(): CurrentUser | null {
        const raw = this.read(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    }
}  