import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ICategories } from '../../interfaces/categories.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private myAppUrl: string;
  private myApiUrl: string;
  
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/categories/'
  }
  getCategories(): Observable<ICategories[]> {
    return this.http.get<ICategories[]>(`${this.myAppUrl}${this.myApiUrl}`);
   }
}
