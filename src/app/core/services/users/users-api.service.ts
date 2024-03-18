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
    //el siguiente metodo es para eliminar un usuario
    deleteUser(id: number): Observable<void> {
      return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`)
    }
   //el siguiente metodo es para crear un nuevo usuario
    createUser(product: IUsers): Observable<void> {
      return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`,product)
    }
    //el siguiente metodo es para obtener un solo usuario
    getUser(id: number): Observable<IUsers> {
      return this.http.get<IUsers>(`${this.myAppUrl}${this.myApiUrl}${id}`)
    }
    //el siguiente metodo es para actualizar un usuario
    updateUser(id: number, user: IUsers): Observable<void> {
      return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, user);
    }
}
