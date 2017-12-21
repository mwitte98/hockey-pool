import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
  constructor(
    private http: Http
  ) {}

  get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
    return this.http.get(`/api${path}`, { headers: this.setHeaders(), search: params })
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  post(path: string, body: any = {}): Observable<any> {
    return this.http.post(`/api${path}`, JSON.stringify(body), { headers: this.setHeaders() })
      .catch(this.formatErrors)
      .map((res: Response) =>  res.json());
  }

  put(path: string, body: any = {}): Observable<any> {
    return this.http.put(`/api${path}`, JSON.stringify(body), { headers: this.setHeaders() })
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  delete(path: string): Observable<any> {
    return this.http.delete(`/api${path}`, { headers: this.setHeaders() })
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  private setHeaders(): Headers {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    return new Headers(headersConfig);
  }

  private formatErrors(error: any): Observable<any> {
    return Observable.throw(error.json());
  }
}
