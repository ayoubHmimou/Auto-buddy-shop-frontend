import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '@/app/core/auth/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.html'
})
export class Login {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    email: string = '';
    password: string = '';
    checked: boolean = false;

    // Signals: the app runs zoneless, so plain fields updated inside an HTTP
    // callback do NOT trigger change detection (the UI would stay "loading").
    readonly loading = signal(false);
    readonly error = signal<string | null>(null);

    submit(): void {
        if (!this.email || !this.password || this.loading()) return;

        this.loading.set(true);
        this.error.set(null);

        this.auth.login(this.email, this.password).subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigate(['/']);
            },
            error: () => {
                this.loading.set(false);
                this.error.set('Email ou mot de passe incorrect');
            }
        });
    }
}
