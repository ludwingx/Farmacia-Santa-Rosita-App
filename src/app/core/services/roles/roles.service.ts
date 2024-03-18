import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IRoles } from '../../interfaces/roles.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private myAppUrl: string;
  private myApiUrl: string;
  
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/roles/'
  }
  getRoles(): Observable<IRoles[]> {
    return this.http.get<IRoles[]>(`${this.myAppUrl}${this.myApiUrl}`);
   }
}
