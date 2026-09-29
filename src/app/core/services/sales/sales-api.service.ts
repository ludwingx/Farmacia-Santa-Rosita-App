import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ISale } from '../../interfaces/sales.interface';

@Injectable({
  providedIn: 'root'
})
export class SalesApiService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/sales/';
  }

  getSales(): Observable<ISale[]> {
    return this.http.get<ISale[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getSale(id: number): Observable<ISale> {
    return this.http.get<ISale>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  createSale(sale: ISale): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, sale);
  }

  cancelSale(id: number): Observable<any> {
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl}cancel/${id}`, {});
  }
}
