import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth-service';
import { SiPermiso } from '../../shared/directives/si-permiso';

@Component({
  selector: 'app-inicio', standalone: true, imports: [RouterLink, SiPermiso],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio { protected readonly auth = inject(AuthService); }
