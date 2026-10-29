import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { mensajeError } from '../../../../core/utils/http-error';
import { SiPermiso } from '../../../../shared/directives/si-permiso';
import { VehiculoApiService } from '../../services/vehiculo-service';
import { Cliente, Vehiculo } from '../../models/vehiculo.model';

@Component({
  selector: 'app-vehiculo-list', standalone: true, imports: [RouterLink, SiPermiso],
  templateUrl: './vehiculo-list.html',
  styleUrl: './vehiculo-list.css',
})
export class VehiculoList implements OnInit {
  private readonly api = inject(VehiculoApiService);
  readonly vehiculos = signal<Vehiculo[]>([]);
  readonly clientes = signal<Cliente[]>([]);
  readonly clienteId = signal<number | null>(null);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.api.listarClientes().subscribe({
      next: data => this.clientes.set(data),
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
    this.cargar();
  }
  cargar(): void {
    this.cargando.set(true); this.error.set(null);
    this.api.listar(this.clienteId() ?? undefined).subscribe({
      next: data => { this.vehiculos.set(data); this.cargando.set(false); },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
    });
  }
  filtrar(value: string): void { this.clienteId.set(value ? Number(value) : null); this.cargar(); }
  eliminar(vehiculo: Vehiculo): void {
    if (!confirm(`¿Eliminar el vehículo ${vehiculo.placa}?`)) return;
    this.error.set(null);
    this.api.eliminar(vehiculo.id).subscribe({
      next: () => this.vehiculos.update(rows => rows.filter(row => row.id !== vehiculo.id)),
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
  }
}
