import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-aviso-sesion', standalone: true,
  templateUrl: './aviso-sesion.html',
  styleUrl: './aviso-sesion.css',
})
export class AvisoSesion {
  protected readonly auth = inject(AuthService);
  protected readonly cuentaRegresiva = computed(() => {
    const seconds = this.auth.segundosRestantes();
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  });
}
