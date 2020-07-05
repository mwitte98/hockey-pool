import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse, EntryRequest } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  constructor(private apiService: ApiService) {}

  get(): Observable<ApiResponse> {
    return this.apiService.get('/entries');
  }

  create(request: EntryRequest): Observable<any> {
    return this.apiService.post('/entries', request);
  }

  update(id: number, request: EntryRequest): Observable<any> {
    return this.apiService.put(`/entries/${id}`, request);
  }
}
