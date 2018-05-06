import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  constructor(
    private apiService: ApiService
  ) {}

  get(): Observable<ApiResponse> {
    return this.apiService.get('/entries');
  }
}
