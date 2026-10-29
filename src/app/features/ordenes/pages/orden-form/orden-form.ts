import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { mensajeError } from '../../../../core/utils/http-error';
import { Servicio } from '../../../servicios/models/servicio.model';
import { ServicioApiService } from '../../../servicios/services/servicio-service';
import { Vehiculo } from '../../../vehiculos/models/vehiculo.model';
import { VehiculoApiService } from '../../../vehiculos/services/vehiculo-service';
import { OrdenApiService } from '../../services/orden-service';
import { OrdenRequest } from '../../models/orden.model';

@Component({
  selector: 'app-orden-form', standalone: true, imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './orden-form.html',
  styleUrl: './orden-form.css',
})
export class OrdenForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly ordenApi = inject(OrdenApiService);
  private readonly vehiculoApi = inject(VehiculoApiService);
  private readonly servicioApi = inject(ServicioApiService);
  readonly vehiculos = signal<Vehiculo[]>([]);
  readonly servicios = signal<Servicio[]>([]);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly exito = signal<{ id: number; numero: string } | null>(null);
  readonly form = this.fb.group({
    vehiculoId: [0, [Validators.required, Validators.min(1)]],
    kilometraje: [0, [Validators.required, Validators.min(0), Validators.max(9999999)]],
    detalles: this.fb.array([this.crearLinea()]),
  });
  get detalles(): FormArray { return this.form.controls.detalles; }

  ngOnInit(): void {
    let ready = 0;
    const finish = () => { ready++; if (ready === 2) this.cargando.set(false); };
    this.vehiculoApi.listar().subscribe({ next: rows => { this.vehiculos.set(rows); finish(); }, error: e => { this.error.set(mensajeError(e)); finish(); } });
    this.servicioApi.listar().subscribe({ next: rows => { this.servicios.set(rows.filter(s => s.activo)); finish(); }, error: e => { this.error.set(mensajeError(e)); finish(); } });
  }

  private crearLinea() { return this.fb.group({ servicioId: [0, [Validators.required, Validators.min(1)]], cantidad: [1, [Validators.required, Validators.min(1), Validators.max(5)]] }); }
  agregarLinea(): void { if (this.detalles.length < 10) this.detalles.push(this.crearLinea()); }
  quitarLinea(index: number): void { if (this.detalles.length > 1) this.detalles.removeAt(index); }
  servicioDe(index: number): Servicio | undefined { return this.servicios().find(s => s.id === Number(this.detalles.at(index).get('servicioId')?.value)); }
  opcionesPara(index: number): Servicio[] {
    const current = Number(this.detalles.at(index).get('servicioId')?.value);
    const selected = this.detalles.controls.map((line, i) => i === index ? 0 : Number(line.get('servicioId')?.value));
    return this.servicios().filter(s => s.id === current || !selected.includes(s.id));
  }
  subtotal(index: number): number {
    const line = this.detalles.at(index);
    return (this.servicioDe(index)?.precio ?? 0) * Number(line.get('cantidad')?.value ?? 0);
  }
  get total(): number { return this.detalles.controls.reduce((sum, _line, i) => sum + this.subtotal(i), 0); }
  get servicioDuplicado(): boolean {
    const ids = this.detalles.controls.map(line => Number(line.get('servicioId')?.value)).filter(id => id > 0);
    return new Set(ids).size !== ids.length;
  }

  registrar(): void {
    this.error.set(null); this.form.markAllAsTouched();
    if (this.form.invalid || this.guardando() || this.servicioDuplicado) {
      if (this.servicioDuplicado) this.error.set('Cada servicio solo puede aparecer una vez en la misma orden.');
      return;
    }
    const raw = this.form.getRawValue();
    const request: OrdenRequest = {
      vehiculoId: Number(raw.vehiculoId), kilometraje: Number(raw.kilometraje),
      detalles: raw.detalles.map(line => ({ servicioId: Number(line.servicioId), cantidad: Number(line.cantidad) })),
    };
    this.guardando.set(true); this.exito.set(null);
    this.ordenApi.registrar(request).subscribe({
      next: order => { this.exito.set({ id: order.id, numero: order.numero }); this.guardando.set(false); },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.guardando.set(false); },
    });
  }
}
