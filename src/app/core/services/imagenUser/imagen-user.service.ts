import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagenUserService {
  private myAppUrl: string;
  private myApiUrl: string;
  private myApiUrl2: string;
  
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/users';
    this.myApiUrl2= '/api/image-user';
  }

  getUserImage(id: number): Observable<void>{
    return this.http.get<void>(`${this.myAppUrl}${this.myApiUrl}/${id}/image`);
  }
  updateUserImage(id: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl2}/${id}`, formData);
}
}