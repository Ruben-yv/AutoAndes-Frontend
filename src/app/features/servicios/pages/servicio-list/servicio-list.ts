import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { mensajeError } from '../../../../core/utils/http-error';
import { SiPermiso } from '../../../../shared/directives/si-permiso';
import { ServicioApiService } from '../../services/servicio-service';
import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'app-servicio-list', standalone: true, imports: [RouterLink, SiPermiso, CurrencyPipe],
  templateUrl: './servicio-list.html',
  styleUrl: './servicio-list.css',
})
export class ServicioList implements OnInit {
  private readonly api = inject(ServicioApiService);
  readonly servicios = signal<Servicio[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly termino = signal('');
  readonly filtrados = computed(() => {
    const q = this.termino().trim().toLocaleLowerCase();
    return this.servicios().filter(s => `${s.codigo} ${s.nombre}`.toLocaleLowerCase().includes(q));
  });
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.cargando.set(true); this.error.set(null);
    this.api.listar().subscribe({
      next: data => { this.servicios.set(data); this.cargando.set(false); },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
    });
  }
  darDeBaja(servicio: Servicio): void {
    if (!confirm(`¿Dar de baja el servicio ${servicio.codigo} - ${servicio.nombre}?`)) return;
    this.error.set(null);
    this.api.darDeBaja(servicio.id).subscribe({
      next: updated => this.servicios.update(rows => rows.map(row => row.id === updated.id ? updated : row)),
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
  }
}
