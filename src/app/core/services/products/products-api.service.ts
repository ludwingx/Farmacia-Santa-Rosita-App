import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProductsList } from '../../interfaces/products.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  apiUrl  = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<IProductsList[]> {
    return this.http.get<IProductsList[]>('${this.apiUrl}');
  }
  getProduct(id:string): Observable<IProductsList>{
    return this.http.get<IProductsList>('${this.apiUrl}/${id}');
  }
}
