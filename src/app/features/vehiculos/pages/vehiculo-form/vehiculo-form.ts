import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { erroresDeValidacion, mensajeError } from '../../../../core/utils/http-error';
import { Cliente, VehiculoRequest } from '../../models/vehiculo.model';
import { VehiculoApiService } from '../../services/vehiculo-service';

@Component({
  selector: 'app-vehiculo-form', standalone: true, imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './vehiculo-form.html',
  styleUrl: './vehiculo-form.css',
})
export class VehiculoForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(VehiculoApiService);
  private readonly router = inject(Router);
  readonly id = input<string>();
  readonly clientes = signal<Cliente[]>([]);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly serverErrors = signal<Record<string, string>>({});
  readonly form = this.fb.group({
    placa: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-\d{3}$/)]],
    marca: ['', [Validators.required, Validators.maxLength(40)]],
    modelo: ['', [Validators.required, Validators.maxLength(40)]],
    anio: [2026, [Validators.required, Validators.min(1990), Validators.max(2027)]],
    clienteId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.cargando.set(true);
    this.api.listarClientes().subscribe({
      next: rows => { this.clientes.set(rows); if (!this.id()) this.cargando.set(false); },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
    });
    const rawId = this.id();
    if (!rawId) return;
    const id = Number(rawId);
    if (!Number.isInteger(id) || id < 1) { this.error.set('El identificador del vehículo no es válido.'); this.cargando.set(false); return; }
    this.api.obtener(id).subscribe({
      next: v => { this.form.patchValue({ placa: v.placa, marca: v.marca, modelo: v.modelo, anio: v.anio, clienteId: v.clienteId }); this.cargando.set(false); },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
    });
  }

  guardar(): void {
    this.error.set(null); this.serverErrors.set({}); this.form.markAllAsTouched();
    if (this.form.invalid || this.guardando()) return;
    const raw = this.form.getRawValue();
    const request: VehiculoRequest = { placa: raw.placa.trim().toUpperCase(), marca: raw.marca.trim(), modelo: raw.modelo.trim(), anio: Number(raw.anio), clienteId: Number(raw.clienteId) };
    this.guardando.set(true);
    const rawId = this.id();
    const operation = rawId ? this.api.actualizar(Number(rawId), request) : this.api.crear(request);
    operation.subscribe({
      next: () => this.router.navigate(['/vehiculos']),
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.serverErrors.set(erroresDeValidacion(e)); this.guardando.set(false); },
    });
  }
  servidor(field: string): string | null { return this.serverErrors()[field] ?? null; }
}
