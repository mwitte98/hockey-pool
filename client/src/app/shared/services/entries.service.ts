import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiResponse } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable()
export class EntriesService {
  constructor(
    private apiService: ApiService
  ) {}

  get(): Observable<ApiResponse> {
    return this.apiService.get('/entries');
  }
}
