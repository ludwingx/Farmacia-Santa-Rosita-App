import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { IUsers } from '../../interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private myApiUrl: string = '/api/auth';
  private authTokenKey = 'token';
  private loggedInUserKey = 'loggedInUser';

  private authStatusSubject = new BehaviorSubject<boolean>(this.checkTokenExists());
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  private checkTokenExists(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(this.authTokenKey);
    }
    return false;
  }

  get myAppUrl(): string {
    return environment.endpoint;
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}/login`, credentials).pipe(
      map((response) => {
        if (response && response.token) {
          this.setToken(response.token);
          this.setLoggedInUser(response.user);
          return response;
        }
        return response;
      }),
      catchError((error) => {
        console.error('Error en el inicio de sesión:', error);
        throw error;
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}/register`, userData).pipe(
      map((response) => {
        if (response && response.token) {
          this.setToken(response.token);
          this.setLoggedInUser(response.user);
          return response;
        }
        return response;
      }),
      catchError((error) => {
        console.error('Error en el registro de usuario:', error);
        throw error;
      })
    );
  }

  private isDemoModeKey = 'isDemoMode';

  setDemoMode(isDemo: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      if (isDemo) {
        localStorage.setItem(this.isDemoModeKey, 'true');
      } else {
        localStorage.removeItem(this.isDemoModeKey);
      }
    }
  }

  isDemoActive(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.isDemoModeKey) === 'true' || 
             (typeof window !== 'undefined' && window.location.pathname.startsWith('/demo'));
    }
    return false;
  }

  loginDemo(): void {
    if (isPlatformBrowser(this.platformId)) {
      const demoUser: IUsers = {
        id: 1,
        username: 'admin',
        ci: 8845129,
        name: 'Dra. Rosita Meneses',
        email: 'rosita@farmaciasantarosita.com',
        password: '',
        image: '',
        status_id: 1,
        status: { id: 1, name: 'Activo' },
        role: { id: 1, name: 'Administrador' }
      };
      this.setDemoMode(true);
      this.setToken('demo-jwt-token-farmacia-santa-rosita');
      this.setLoggedInUser(demoUser);
    }
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.authTokenKey, token);
      this.authStatusSubject.next(true);
    }
  }

  setLoggedInUser(user: IUsers): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.loggedInUserKey, JSON.stringify(user));
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.authTokenKey);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return isPlatformBrowser(this.platformId) && !!this.getToken();
  }

  checkAuthentication(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 1. Limpiar localStorage
      localStorage.removeItem(this.authTokenKey);
      localStorage.removeItem(this.loggedInUserKey);
      localStorage.removeItem(this.isDemoModeKey);

      // 2. Limpiar sessionStorage
      sessionStorage.removeItem('angular17TokenData');
      sessionStorage.clear();

      // 3. Limpiar todas las cookies del navegador
      try {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          }
        }
      } catch (e) {
        console.error('Error al limpiar cookies:', e);
      }

      // 4. Limpiar clases del layout para que no queden remanentes en el body
      document.body.classList.remove('body-pd');
      const header = document.getElementById('header');
      if (header) {
        header.classList.remove('body-pd');
      }
      const navBar = document.getElementById('nav-bar');
      if (navBar) {
        navBar.classList.remove('shown');
      }
    }

    // 5. Notificar a toda la aplicacion el cambio de estado de autenticacion
    this.authStatusSubject.next(false);

    // 6. Navegacion limpia a login
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getLoggedInUserData(): Observable<IUsers> {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem(this.loggedInUserKey);
      if (userData) {
        try {
          const user: IUsers = JSON.parse(userData);
          return of(user);
        } catch (e) {
          return throwError(() => 'Error al parsear datos del usuario');
        }
      } else {
        return throwError(() => 'No se encontraron datos del usuario en almacenamiento local');
      }
    } else {
      return throwError(() => 'No se puede acceder a almacenamiento en entorno servidor');
    }
  }

  getUserId(): Observable<number> {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem(this.loggedInUserKey);
      if (userData) {
        try {
          const user: IUsers = JSON.parse(userData);
          return of(user.id);
        } catch (e) {
          return throwError(() => 'Error al parsear usuario');
        }
      }
      return throwError(() => 'No se encontraron datos del usuario');
    }
    return throwError(() => 'No disponible en servidor');
  }
}