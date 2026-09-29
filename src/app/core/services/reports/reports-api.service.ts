import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IDashboardSummary } from '../../interfaces/reports.interface';
import { IProductsList } from '../../interfaces/products.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportsApiService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/reports/';
  }

  getDashboardSummary(): Observable<IDashboardSummary> {
    return this.http.get<IDashboardSummary>(`${this.myAppUrl}${this.myApiUrl}dashboard`);
  }

  getCriticalStock(): Observable<IProductsList[]> {
    return this.http.get<IProductsList[]>(`${this.myAppUrl}${this.myApiUrl}critical-stock`);
  }
}
