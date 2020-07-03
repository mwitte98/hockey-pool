import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Team } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  constructor(private apiService: ApiService) {}

  get(): Observable<Team[]> {
    return this.apiService.get('/teams');
  }

  update(id: number, team: Team): Observable<any> {
    return this.apiService.put(`/teams/${id}`, team);
  }
}
