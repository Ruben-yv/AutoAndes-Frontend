import { DatePipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth-service';

@Component({
  selector: 'app-header', standalone: true, imports: [RouterLink, DatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly auth = inject(AuthService);
  readonly toggleMenu = output<void>();
}
