import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminEntry, DisplayEntry } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  constructor(private apiService: ApiService) {}

  get(): Observable<AdminEntry[]> {
    return this.apiService.get('/entries');
  }

  getPlayerIds(): Observable<string[][]> {
    return this.apiService.get('/entries?field_groups=player_ids');
  }

  getDisplay(): Observable<DisplayEntry[]> {
    return this.apiService.get('/entries?field_groups=display');
  }

  create(request: AdminEntry): Observable<any> {
    return this.apiService.post('/entries', request);
  }

  update(id: number, request: AdminEntry): Observable<any> {
    return this.apiService.put(`/entries/${id}`, request);
  }
}
