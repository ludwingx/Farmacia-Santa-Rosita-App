import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, NgModule } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { UsersApiService } from '../users/users-api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IUsers } from '../../interfaces/users.interface';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private myAppUrl: string;
  private myApiUrl: string;
  private authTokenKey = 'token'; // Usar el mismo nombre de clave en localStorage
  private jwtHelper = new JwtHelperService();
  private loggedInUser: any;

  constructor(private http: HttpClient,
    @Inject (PLATFORM_ID) private platformId: Object,
    private router: Router,
    private userService: UsersApiService,
    ) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/auth';

  }

  setToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}/login`, credentials).pipe(
      map((response) => {
        if (response && response.token) {
          this.setToken(response.token);
          this.loggedInUser = response.user;
          
          console.log('login successful');
          console.log(response.user);
        }
        return response;
      }),
      catchError((error) => {
        throw error;
      })
    );
  } 
  logout(): void {
    localStorage.removeItem(this.authTokenKey); // Remove token from localStorage
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.authTokenKey);
    }
    return null;
  }
  isAuthenticated(): boolean {
    const authToken = this.getToken();
    return !!authToken;
  }
  isLoggedIn(): boolean {
    const authToken = this.getToken();
    return !!authToken;
  }
  getLoggedInUserData(): Promise<IUsers | null> {
    return new Promise((resolve, reject) => {
      const token = this.getToken();
      if (!token) {
        this.loggedInUser = null;
        resolve(null);
      } else {
        this.http.get<any>('/api/user').pipe(
          map(response => {
            // Mapeo de datos del usuario
            return { id: response.id, name: response.name } as IUsers;
          }),
          catchError(error => {
            console.error('Error al obtener datos del usuario:', error);
            return throwError('Error al obtener datos del usuario');
          })
        ).subscribe(
          (user: IUsers) => {
            this.loggedInUser = user;
            resolve(user);
          },
          error => {
            this.loggedInUser = null;
            reject(error); // Rechazar la promesa con el error
          }
        );
      }
    });
  }
  loginSuccess(user: IUsers): void {
    this.loggedInUser = user;
  }

 getLoggedInUser(): IUsers{
    return this.loggedInUser ;
  }
}