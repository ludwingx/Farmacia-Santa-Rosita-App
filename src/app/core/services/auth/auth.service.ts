import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, NgModule } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { IUsers } from '../../interfaces/users.interface';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private myAppUrl: string;
  private myApiUrl: string;
  private authTokenKey = 'token'; // Usar el mismo nombre de clave en localStorage
  private loggedInUserKey = 'loggedInUser';
  constructor(private http: HttpClient,
    @Inject (PLATFORM_ID) private platformId: Object,
    private router: Router,
    ) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/auth';
    this.checkAuthentication();
  }
  login(credentials: any): Observable<any> {
    console.log('Intento de inicio de sesión:', credentials);
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}/login`, credentials).pipe(
      map((response) => {
        if (response && response.token) {
          console.log('Inicio de sesión exitoso. Token recibido:', response.token);
          this.setToken(response.token);
          this.setLoggedInUser(response.user);
          return response; // Puedes devolver cualquier otra cosa que necesites
        }
      }),
      catchError((error) => {
        console.error('Error en el inicio de sesión:', error);
        throw error;
      })
    );
  }

  setToken(token: string): void {
    console.log('Guardando token en el almacenamiento local:', token);
    localStorage.setItem(this.authTokenKey, token);
  }

  setLoggedInUser(user: IUsers): void {
    console.log('Guardando usuario autenticado en el almacenamiento local:', user);
    localStorage.setItem(this.loggedInUserKey, JSON.stringify(user));
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(this.authTokenKey);
      console.log('Obteniendo token del almacenamiento local:', token);
      return token;
    }
    return null;
  }
  isAuthenticated(): boolean {
    const authToken = this.getToken();
    console.log('¿Está autenticado?', !!authToken);
    return !!authToken;
  }

  checkAuthentication(): void {
    console.log('Verificando autenticación...');
    if (!this.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      console.log('No está autenticado. Redirigiendo al inicio de sesión.');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 0);
    } else {
      console.log('Está autenticado.');
    }
  }
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.authTokenKey); // Remove token from localStorage
      localStorage.removeItem(this.loggedInUserKey); // Remove user data from localStorage
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getLoggedInUserData(): Observable<IUsers> {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem(this.loggedInUserKey);
      if (userData) {
        const user: IUsers = JSON.parse(userData);
        console.log('Datos del usuario autenticado:', user);
        return of(user);
      } else {
        console.error('No se encontraron datos del usuario en el almacenamiento local');
        return throwError('No se encontraron datos del usuario en el almacenamiento local');
      }
    } else {
      console.error('El objeto localStorage no está definido en este entorno.');
      return throwError('El objeto localStorage no está definido en este entorno.');
    }
  }
  getUserId(): Observable<number> {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem(this.loggedInUserKey);
      if (userData) {
        const user: IUsers = JSON.parse(userData);
        return of(user.id);
      } else {
        console.error('No se encontraron datos del usuario en el almacenamiento local');
        return throwError('No se encontraron datos del usuario en el almacenamiento local');
      }
    } else {
      console.error('El objeto localStorage no está definido en este entorno.');
      return throwError('El objeto localStorage no está definido en este entorno.');
    }
  }
}