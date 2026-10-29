import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Permiso, PerfilUsuario, Sesion } from './auth.model';

const SESSION_KEY = 'autoandes.sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly currentSession = signal<Sesion | null>(this.readStoredSession());
  private timer?: ReturnType<typeof setInterval>;

  readonly sesion = this.currentSession.asReadonly();
  readonly autenticado = computed(() => this.currentSession() !== null);
  readonly segundosRestantes = signal(0);
  readonly porVencer = computed(() => this.autenticado() && this.segundosRestantes() <= 120);
  readonly avisoOculto = signal(false);

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    const session = this.currentSession();
    if (session) this.startTimer(session);
  }

  login(credentials: LoginRequest): Observable<Sesion> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
      map((response) => ({
        token: response.token,
        expiraEn: Date.now() + response.expiraEnSegundos * 1000,
        username: response.username,
        nombreCompleto: response.nombreCompleto,
        roles: response.roles,
        permisos: response.permisos,
      })),
      tap((session) => this.start(session)),
    );
  }

  obtenerPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.baseUrl}/me`);
  }

  cerrarSesion(motivo?: 'expirada', volverA?: string): void {
    this.stopTimer();
    sessionStorage.removeItem(SESSION_KEY);
    this.currentSession.set(null);
    this.segundosRestantes.set(0);
    this.avisoOculto.set(false);
    const queryParams: Record<string, string> = {};
    if (motivo) queryParams['expirada'] = '1';
    if (volverA && volverA !== '/login') queryParams['returnUrl'] = volverA;
    this.router.navigate(['/login'], { queryParams });
  }

  token(): string | null {
    const session = this.currentSession();
    return session && Date.now() < session.expiraEn ? session.token : null;
  }

  tienePermiso(permiso: Permiso): boolean {
    return this.currentSession()?.permisos.includes(permiso) ?? false;
  }

  ocultarAviso(): void {
    this.avisoOculto.set(true);
  }

  private start(session: Sesion): void {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.currentSession.set(session);
    this.avisoOculto.set(false);
    this.startTimer(session);
  }

  private startTimer(session: Sesion): void {
    this.stopTimer();
    this.updateRemaining(session);
    this.timer = setInterval(() => {
      const current = this.currentSession();
      if (!current) return this.stopTimer();
      this.updateRemaining(current);
      if (this.segundosRestantes() <= 0) this.cerrarSesion('expirada', this.router.url);
    }, 1000);
  }

  private updateRemaining(session: Sesion): void {
    this.segundosRestantes.set(Math.max(0, Math.floor((session.expiraEn - Date.now()) / 1000)));
  }

  private stopTimer(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private readStoredSession(): Sesion | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw) as Sesion;
      if (!session.token || Date.now() >= session.expiraEn) {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session;
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }
}
