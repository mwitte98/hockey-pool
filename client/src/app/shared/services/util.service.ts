import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';

import { ApiResponse, Entry, Player, PlayerStatTiebreaker, Team } from '../types/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  skaterTiebreakers: PlayerStatTiebreaker[] = [
    { attr: 'points', sortDirection: 'desc' },
    { attr: 'goals', sortDirection: 'desc' },
    { attr: 'assists', sortDirection: 'desc' },
    { attr: 'gwg', sortDirection: 'desc' },
    { attr: 'shg', sortDirection: 'desc' },
    { attr: 'otg', sortDirection: 'desc' },
    { attr: 'team', sortDirection: 'asc', nestedAttr: 'abbr' },
    { attr: 'last_name', sortDirection: 'asc' },
    { attr: 'first_name', sortDirection: 'asc' },
    { attr: 'position', sortDirection: 'asc' }
  ];
  goalieTiebreakers: PlayerStatTiebreaker[] = [
    { attr: 'points', sortDirection: 'desc' },
    { attr: 'wins', sortDirection: 'desc' },
    { attr: 'shutouts', sortDirection: 'desc' },
    { attr: 'otl', sortDirection: 'desc' },
    { attr: 'assists', sortDirection: 'desc' },
    { attr: 'goals', sortDirection: 'desc' },
    { attr: 'team', sortDirection: 'asc', nestedAttr: 'abbr' },
    { attr: 'last_name', sortDirection: 'asc' },
    { attr: 'first_name', sortDirection: 'asc' }
  ];

  combineApiResponseData(response: ApiResponse): Entry[] {
    const players = response.players;
    players.map((p) => (p.team = response.teams.find((t) => t.id === p.team_id)));
    response.entries.map((entry: Entry) => {
      entry.players = [];
      entry.player_ids.map((pId) => entry.players.push(players.find((p) => p.id === pId)));
      entry.players.map((player: Player) => {
        player.team.logoUrl = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${player.team.nhl_id}.svg`;
      });
      this.sortPlayersByTeam(entry);
    });
    return response.entries;
  }

  sortPlayersByTeam(entry: Entry): void {
    entry.players.sort((a: Player, b: Player) => {
      const teamA = a.team;
      const teamB = b.team;
      if (teamA.is_eliminated !== teamB.is_eliminated) {
        return teamA.is_eliminated ? 1 : -1;
      }
      const conferenceDiff = teamA.conference.localeCompare(teamB.conference);
      if (conferenceDiff !== 0) {
        return conferenceDiff;
      }
      return teamA.rank - teamB.rank;
    });
  }

  sortPlayersByStats(players: Player[], tiebreakers: PlayerStatTiebreaker[], sort?: Sort): Player[] {
    let sameDirection = true;
    if (sort && sort.direction !== '') {
      sameDirection = sort.direction === tiebreakers.find((t) => t.attr.includes(sort.active)).sortDirection;
    }

    return players.sort((a, b) => {
      let diff = 0;
      for (const tiebreaker of tiebreakers) {
        const aAttr = this.getAttr(a, tiebreaker);
        const bAttr = this.getAttr(b, tiebreaker);
        if (typeof aAttr === 'number') {
          diff = bAttr - aAttr;
        } else if (aAttr > bAttr) {
          diff = 1;
        } else if (aAttr < bAttr) {
          diff = -1;
        } else {
          diff = 0;
        }
        if (!sameDirection) {
          diff = diff * -1;
        }
        if (diff !== 0) {
          break;
        }
      }
      return diff;
    });
  }

  getAttr(player: Player, tiebreaker: PlayerStatTiebreaker): any {
    let attr = player[tiebreaker.attr];
    if (tiebreaker.nestedAttr != null) {
      attr = attr[tiebreaker.nestedAttr];
    }
    return attr;
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
