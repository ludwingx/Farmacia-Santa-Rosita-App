import { Injectable } from '@angular/core';
import { IStorage_location } from '../../interfaces/storage_location.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageLocationService {
  private myAppUrl: string;
  private myApiUrl: string;
  
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/storage_location/'
  }
  getStorageLocations(): Observable<IStorage_location[]> {
    return this.http.get<IStorage_location[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
}