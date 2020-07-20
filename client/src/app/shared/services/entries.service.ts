import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse, Entry } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  constructor(private apiService: ApiService) {}

  get(): Observable<ApiResponse> {
    return this.apiService.get('/entries');
  }

  create(request: Entry): Observable<any> {
    return this.apiService.post('/entries', request);
  }

  update(id: number, request: Entry): Observable<any> {
    return this.apiService.put(`/entries/${id}`, request);
  }
}
