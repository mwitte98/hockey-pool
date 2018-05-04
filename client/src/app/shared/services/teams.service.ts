import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Team } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable()
export class TeamsService {
  constructor(
    private apiService: ApiService
  ) {}

  get(): Observable<Team[]> {
    return this.apiService.get('/teams');
  }
}
