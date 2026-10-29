import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AvisoSesion } from '../../shared/components/aviso-sesion/aviso-sesion';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout', standalone: true, imports: [RouterOutlet, Header, Sidebar, AvisoSesion],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout { readonly collapsed = signal(false); }
