import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { mensajeError } from '../../../../core/utils/http-error';
import { SiPermiso } from '../../../../shared/directives/si-permiso';
import { OrdenApiService } from '../../services/orden-service';
import { EstadoOrden, FiltrosOrden, OrdenServicio } from '../../models/orden.model';

@Component({
  selector: 'app-orden-list', standalone: true, imports: [DatePipe, CurrencyPipe, DecimalPipe, RouterLink, SiPermiso],
  templateUrl: './orden-list.html',
  styleUrl: './orden-list.css',
})
export class OrdenList implements OnInit {
  private readonly api = inject(OrdenApiService);
  readonly ordenes = signal<OrdenServicio[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly placa = signal('');
  readonly estado = signal<EstadoOrden | ''>('');
  readonly desde = signal('');
  readonly hasta = signal('');
  ngOnInit(): void { this.buscar(); }
  buscar(): void {
    this.cargando.set(true); this.error.set(null);
    const filters: FiltrosOrden = { placa: this.placa(), estado: this.estado(), desde: this.desde(), hasta: this.hasta() };
    this.api.listar(filters).subscribe({
      next: rows => { this.ordenes.set(rows); this.cargando.set(false); },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
    });
  }
  limpiar(): void { this.placa.set(''); this.estado.set(''); this.desde.set(''); this.hasta.set(''); this.buscar(); }
  anular(orden: OrdenServicio): void {
    if (orden.estado !== 'REGISTRADA') return;
    const motivo = window.prompt(`Motivo para anular la orden ${orden.numero}:`);
    if (!motivo?.trim()) return;
    this.api.anular(orden.id, motivo.trim()).subscribe({
      next: () => this.buscar(),
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
  }
}
