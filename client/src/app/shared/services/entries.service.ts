import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse, Entry } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  constructor(private apiService: ApiService) {}

  get(): Observable<Entry[]> {
    return this.apiService.get('/entries');
  }

  getPlayerIds(): Observable<number[][]> {
    return this.apiService.get('/entries?field_groups=player_ids');
  }

  getAllData(): Observable<ApiResponse> {
    return this.apiService.get('/entries?field_groups=all_data');
  }

  create(request: Entry): Observable<any> {
    return this.apiService.post('/entries', request);
  }

  update(id: number, request: Entry): Observable<any> {
    return this.apiService.put(`/entries/${id}`, request);
  }
}
