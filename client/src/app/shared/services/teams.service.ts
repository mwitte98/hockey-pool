import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminTeam, HomeTeam, PlayerStatsTeam, UpsertEntryTeam } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  constructor(private apiService: ApiService) {}

  get(): Observable<AdminTeam[]> {
    return this.apiService.get('/teams');
  }

  getHome(): Observable<HomeTeam[]> {
    return this.apiService.get('/teams?field_groups=home');
  }

  getPlayerStats(): Observable<PlayerStatsTeam[]> {
    return this.apiService.get('/teams?field_groups=player_stats');
  }

  getUpsertEntry(): Observable<UpsertEntryTeam[]> {
    return this.apiService.get('/teams?field_groups=upsert_entry');
  }

  update(id: number, team: AdminTeam): Observable<any> {
    return this.apiService.put(`/teams/${id}`, team);
  }
}
