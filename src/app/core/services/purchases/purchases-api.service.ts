import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IPurchase } from '../../interfaces/purchases.interface';

@Injectable({
  providedIn: 'root'
})
export class PurchasesApiService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/purchases/';
  }

  getPurchases(): Observable<IPurchase[]> {
    return this.http.get<IPurchase[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getPurchase(id: number): Observable<IPurchase> {
    return this.http.get<IPurchase>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  createPurchase(purchase: IPurchase): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, purchase);
  }
}
