import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get(path: string): Observable<any> {
    return this.http.get(`/api${path}`);
  }

  post(path: string, body: any = {}): Observable<any> {
    return this.http.post(`/api${path}`, body);
  }

  put(path: string, body: any = {}): Observable<any> {
    return this.http.put(`/api${path}`, body);
  }

  delete(path: string): Observable<any> {
    return this.http.delete(`/api${path}`);
  }
}
