import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IUsers } from '../../interfaces/users.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  private myAppUrl: string;
  private myApiUrl: string;
  
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/users/'
  }
    //
    getListUsers(): Observable<IUsers[]> {
     return this.http.get<IUsers[]>(`${this.myAppUrl}${this.myApiUrl}`);
    }
    //el siguiente metodo es para actualizar un usuario con id y toda la data del user
  // usar formDataToSend this.userService.updateUser(this.userId, formDataToSend).subscribe(
  updateUser(id: number, formDataToSend: FormData): Observable<void> {
    console.log('Nombre de la imagen:', formDataToSend.get('image'));
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, formDataToSend);
  }

   //el siguiente metodo es para crear un nuevo usuario
    createUser(user: IUsers): Observable<void> {
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

    uploadProfileImage(id: number, image: File): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('profileImage', image, image.name);
      return this.http.post<any>(`${this.myAppUrl}/${id}/upload-profile-image`, formData);
    }
}
