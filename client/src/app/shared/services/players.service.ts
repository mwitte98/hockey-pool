import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminPlayer } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  constructor(private apiService: ApiService) {}

  update(id: number, player: AdminPlayer): Observable<any> {
    return this.apiService.put(`/players/${id}`, player);
  }
}
