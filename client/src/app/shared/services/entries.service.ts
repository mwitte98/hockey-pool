import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse, UpdateEntryRequest } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  constructor(private apiService: ApiService) {}

  get(): Observable<ApiResponse> {
    return this.apiService.get('/entries');
  }

  update(id: number, request: UpdateEntryRequest): Observable<any> {
    return this.apiService.put(`/entries/${id}`, request);
  }
}
