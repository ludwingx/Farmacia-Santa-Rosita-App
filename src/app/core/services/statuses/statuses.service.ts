import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IStatuses } from '../../interfaces/statuses';

@Injectable({
  providedIn: 'root'
})
export class StatusesService {

  private myAppUrl: string;
  private myApiUrl: string;
  
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/statuses/'
  }
  getStatuses(): Observable<IStatuses[]> {
    return this.http.get<IStatuses[]>(`${this.myAppUrl}${this.myApiUrl}`);
   }
}
