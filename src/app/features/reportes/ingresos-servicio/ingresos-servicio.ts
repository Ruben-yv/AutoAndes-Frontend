import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { mensajeError } from '../../../core/utils/http-error';
import { ReporteApiService } from '../services/reporte-service';
import { IngresoPorServicio } from '../models/reporte.model';

@Component({
  selector: 'app-reporte-page', standalone: true, imports: [CurrencyPipe, FormsModule],
  templateUrl: './ingresos-servicio.html',
  styleUrl: './ingresos-servicio.css',
})
export class ReportePage implements OnInit {
  private readonly api = inject(ReporteApiService);
  readonly desde = signal('');
  readonly hasta = signal('');
  readonly filas = signal<IngresoPorServicio[]>([]);
  readonly cargando = signal(false);
  readonly consultado = signal(false);
  readonly error = signal<string | null>(null);
  readonly totalIngresos = () => this.filas().reduce((total, fila) => total + fila.importeTotal, 0);
  ngOnInit(): void {
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.desde.set(this.fechaLocal(inicio)); this.hasta.set(this.fechaLocal(hoy));
    this.buscar();
  }
  buscar(): void {
    this.error.set(null);
    if (!this.desde() || !this.hasta() || this.desde() > this.hasta()) { this.error.set('Selecciona un rango de fechas válido.'); return; }
    this.cargando.set(true); this.consultado.set(true);
    this.api.ingresosPorServicio(this.desde(), this.hasta()).subscribe({
      next: rows => { this.filas.set(rows); this.cargando.set(false); },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
    });
  }
  imprimir(): void { window.print(); }
  private fechaLocal(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
