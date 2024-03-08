import { HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { IProductsList } from '../../interfaces/products.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  private myAppUrl: string;
  private myApiUrl: string;
  
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/productos/'
  }

    //Estos son métodos de un servicio en Angular que utilizan el módulo HttpClient
    // para hacer solicitudes HTTP a un API., el siguiente metodo es para obtener todos los productos 

    getListProducts(): Observable<IProductsList[]> {
     return this.http.get<IProductsList[]>(`${this.myAppUrl}${this.myApiUrl}`);
    }
    //el siguiente metodo es para eliminar un producto
    deleteProduct(id: number): Observable<void> {
      return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`)
    }
   //el siguiente metodo es para crear un nuevo producto
    saveProduct(product: IProductsList): Observable<void> {
      return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`,product)
    }
    //el siguiente metodo es para obtener un solo producto
    getProduct(id: number): Observable<IProductsList> {
      return this.http.get<IProductsList>(`${this.myAppUrl}${this.myApiUrl}${id}`)
    }
    //el siguiente metodo es para actualizar un proyecto
    updateProduct(id: number, product: IProductsList): Observable<void> {
      return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, product);
    }
}
