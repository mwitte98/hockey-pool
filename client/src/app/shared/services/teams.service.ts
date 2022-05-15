import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Team } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  constructor(private apiService: ApiService) {}

  get(fieldGroups?: string): Observable<Team[]> {
    const url = fieldGroups == null ? '/teams' : `/teams?field_groups=${fieldGroups}`;
    return this.apiService.get(url);
  }

  update(id: number, team: Team): Observable<any> {
    return this.apiService.put(`/teams/${id}`, team);
  }
}
