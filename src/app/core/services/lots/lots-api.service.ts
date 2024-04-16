import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { ILots } from '../../interfaces/lots';

@Injectable({
  providedIn: 'root'
})
export class LotsApiService {

  private myAppUrl: string;
  private myApiUrl: string;
  
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/lots/';
  }
    getListLots(): Observable<ILots[]> {
     return this.http.get<ILots[]>(`${this.myAppUrl}${this.myApiUrl}`);
    }
    updateUser(id: number, user: ILots): Observable<void> {
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
    updateUserImage(userId: number,  user: ILots, imageFile: File): Observable<any> {
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

}
