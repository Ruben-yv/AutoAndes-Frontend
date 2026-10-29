import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { mensajeError } from '../../../../core/utils/http-error';
import { OrdenApiService } from '../../services/orden-service';
import { OrdenServicio } from '../../models/orden.model';

@Component({
  selector: 'app-orden-detail', standalone: true, imports: [CurrencyPipe, DatePipe, DecimalPipe, RouterLink],
  templateUrl: './orden-detail.html',
})
export class OrdenDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(OrdenApiService);
  readonly orden = signal<OrdenServicio | null>(null);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id < 1) { this.error.set('El identificador de la orden no es válido.'); this.cargando.set(false); return; }
    this.api.obtener(id).subscribe({
      next: row => { this.orden.set(row); this.cargando.set(false); },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
    });
  }
}
