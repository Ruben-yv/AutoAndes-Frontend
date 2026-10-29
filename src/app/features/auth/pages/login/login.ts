import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth-service';
import { mensajeError } from '../../../../core/utils/http-error';

@Component({
  selector: 'app-login', standalone: true, imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly returnUrl = input<string>();
  readonly expirada = input<string>();
  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly verClave = signal(false);
  protected readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.maxLength(72)]],
  });
  ingresar(): void {
    this.error.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid || this.enviando()) return;
    this.enviando.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl(this.destino()),
      error: (err: HttpErrorResponse) => {
        this.enviando.set(false);
        this.form.controls.password.reset();
        this.error.set(mensajeError(err));
      },
    });
  }
  private destino(): string {
    const url = this.returnUrl();
    return url && url.startsWith('/') && !url.startsWith('//') ? url : '/inicio';
  }
}
