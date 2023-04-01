import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminPlayer, HistoricalPlayer } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  constructor(private apiService: ApiService) {}

  getHistorical(): Observable<HistoricalPlayer[]> {
    return this.apiService.get('/players?field_groups=historical');
  }

  update(id: number, player: AdminPlayer): Observable<any> {
    return this.apiService.put(`/players/${id}`, player);
  }
}
