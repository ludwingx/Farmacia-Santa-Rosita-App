import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ISuppliers } from '../../interfaces/suppliers.interface';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private myAppUrl: string;
  private myApiUrl: string;
  
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/suppliers/'
  }
  getSuppliers(): Observable<ISuppliers[]> {
    return this.http.get<ISuppliers[]>(`${this.myAppUrl}${this.myApiUrl}`);
   }
}
