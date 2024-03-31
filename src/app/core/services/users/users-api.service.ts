import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IUsers } from '../../interfaces/users.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  private myAppUrl: string;
  private myApiUrl: string;
  private loggedInUser: any;
  
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/users/';
  }
    getListUsers(): Observable<IUsers[]> {
     return this.http.get<IUsers[]>(`${this.myAppUrl}${this.myApiUrl}`);
    }
    updateUser(id: number, user: IUsers): Observable<void> {
      return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, user);
      
    }
    uploadImage(id: number, imageData: FormData): Observable<any> {
      const uploadUrl = `${this.myAppUrl}${this.myApiUrl}${id}/profile-image`; // Usar la ruta correspondiente
      return this.http.post(uploadUrl, imageData).pipe(
        catchError((error) => {
          console.error('Error al subir la imagen:', error);
          return throwError(() => error);
        })
      );
    }
    updateUserImage(userId: number,  user: IUsers, imageFile: File): Observable<any> {
      const formData = new FormData();
      formData.append('data', JSON.stringify(user)); // Datos del usuario en formato JSON
  
      if (imageFile) {
        formData.append('image', imageFile); // Agregar imagen al FormData si está presente
      }
      return this.http.put<any>(`${this.myApiUrl}/uploads/profile${userId}`, formData).pipe(
        catchError((error) => {
          console.error('Error al actualizar la imagen del usuario:', error);
          return throwError(() => error);
        })
      )
       
    }

   //el siguiente metodo es para crear un nuevo usuario
    createUser(user: IUsers): Observable<any> {
      return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`,user)
    }
    //el siguiente metodo es para obtener un solo usuario
    getUser(id: number): Observable<IUsers> {
      return this.http.get<IUsers>(`${this.myAppUrl}${this.myApiUrl}${id}`)
    }
    //el siguiente metodo es para eliminar un usuario
    deleteUser(id: number, status: number): Observable<void> {
      const statusUpdate = { status_id: status }; // Suponiendo que 'status_id' es el campo en el servidor que representa el estado
      return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}/status`, statusUpdate);;
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
      let errorMessage = 'Error desconocido';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Error código ${error.status}: ${error.message}`;
      }
      console.error(errorMessage);
      return throwError(errorMessage);
    }

    setLoggedInUser(user: any): void {
      this.loggedInUser = user;
    }
  
    getLoggedInUserName(): string {
      return this.loggedInUser ? this.loggedInUser.username : '';
    }

    clearLoggedInUser(): void {
      this.loggedInUser = null;
    }
    getUserById(id: number): Observable<IUsers> {
      // Lógica para obtener la información del usuario por su ID desde el servidor
      return this.http.get<IUsers>(`/api/users/${id}`);
    }
}
