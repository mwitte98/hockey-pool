import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse, Entry, Player, Team } from '../types/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  combineApiResponseData(response: ApiResponse): Entry[] {
    const players = response.players;
    players.map((p) => (p.team = response.teams.find((t) => t.id === p.team_id)));
    response.entries.map((entry: Entry) => {
      entry.players = [];
      entry.player_ids.map((pId) => entry.players.push(players.find((p) => p.id === pId)));
      entry.players.sort((a, b) => {
        if (a.team.is_eliminated === b.team.is_eliminated) {
          return a.team_id - b.team_id;
        }
        return a.team.is_eliminated ? 1 : -1;
      });
    });
    return response.entries;
  }

  subscribeAndUpdateStatus(updateObject: Team | Player | Entry, observable: Observable<any>): void {
    observable.subscribe(
      () => {
        this.updateStatus(updateObject, true);
      },
      () => {
        this.updateStatus(updateObject, false);
      }
    );
  }

  updateStatus(updateObject: Team | Player | Entry, isSuccess: boolean): void {
    updateObject.updateLoading = false;
    if (isSuccess) {
      updateObject.updateSuccess = true;
    } else {
      updateObject.updateFailure = true;
    }
    setTimeout(() => {
      if (isSuccess) {
        updateObject.updateSuccess = false;
      } else {
        updateObject.updateFailure = false;
      }
    }, 3000);
  }
}
