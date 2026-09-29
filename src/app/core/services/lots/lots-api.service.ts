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

    getLot(id: number): Observable<ILots> {
      return this.http.get<ILots>(`${this.myAppUrl}${this.myApiUrl}${id}`);
    }

    saveLot(lot: Partial<ILots>): Observable<any> {
      return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, lot);
    }

    updateLot(id: number, lot: Partial<ILots>): Observable<void> {
      return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, lot);
    }

    deleteLot(id: number): Observable<void> {
      return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
    }

}
