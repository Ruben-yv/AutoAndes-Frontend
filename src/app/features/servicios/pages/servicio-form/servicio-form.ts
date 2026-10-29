import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { erroresDeValidacion, mensajeError } from '../../../../core/utils/http-error';
import { ServicioApiService } from '../../services/servicio-service';
import { ServicioRequest } from '../../models/servicio.model';

@Component({
  selector: 'app-servicio-form', standalone: true, imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './servicio-form.html',
  styleUrl: './servicio-form.css',
})
export class ServicioForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(ServicioApiService);
  private readonly router = inject(Router);
  readonly id = input<string>();
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly serverErrors = signal<Record<string, string>>({});
  readonly form = this.fb.group({
    codigo: ['', [Validators.required, Validators.pattern(/^SRV-\d{3}$/)]],
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    duracionMin: [15, [Validators.required, Validators.min(15), Validators.max(480)]],
  });

  ngOnInit(): void {
    const rawId = this.id();
    if (!rawId) return;
    const id = Number(rawId);
    if (!Number.isInteger(id) || id < 1) { this.error.set('El identificador del servicio no es válido.'); return; }
    this.cargando.set(true);
    this.api.obtener(id).subscribe({
      next: s => { this.form.patchValue({ codigo: s.codigo, nombre: s.nombre, precio: s.precio, duracionMin: s.duracionMin }); this.cargando.set(false); },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
    });
  }

  guardar(): void {
    this.error.set(null); this.serverErrors.set({}); this.form.markAllAsTouched();
    if (this.form.invalid || this.guardando()) return;
    const raw = this.form.getRawValue();
    const request: ServicioRequest = { codigo: raw.codigo.trim().toUpperCase(), nombre: raw.nombre.trim(), precio: Number(raw.precio), duracionMin: Number(raw.duracionMin) };
    this.guardando.set(true);
    const rawId = this.id();
    const operation = rawId ? this.api.actualizar(Number(rawId), request) : this.api.crear(request);
    operation.subscribe({
      next: () => this.router.navigate(['/servicios']),
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.serverErrors.set(erroresDeValidacion(e)); this.guardando.set(false); },
    });
  }

  servidor(campo: string): string | null { return this.serverErrors()[campo] ?? null; }
}
