import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';

import { Entry, Player, PlayerStatTiebreaker, Team } from '../types/interfaces';

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
    { attr: 'lastName', sortDirection: 'asc' },
    { attr: 'firstName', sortDirection: 'asc' },
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
    { attr: 'lastName', sortDirection: 'asc' },
    { attr: 'firstName', sortDirection: 'asc' }
  ];

  sortPlayersByTeam(entry: Entry): void {
    entry.players.sort((a: Player, b: Player) => {
      const teamA = a.team;
      const teamB = b.team;
      if (teamA.isEliminated !== teamB.isEliminated) {
        return teamA.isEliminated ? 1 : -1;
      }
      const conferenceDiff = teamA.conference.localeCompare(teamB.conference);
      if (conferenceDiff !== 0) {
        return conferenceDiff;
      }
      return teamA.rank - teamB.rank;
    });
  }

  sortPlayersByStats(players: Player[], tiebreakers: PlayerStatTiebreaker[], sort?: Sort): Player[] {
    const sameDirection = this.isSameDirection(tiebreakers, sort);

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
          diff *= -1;
        }
        if (diff !== 0) {
          break;
        }
      }
      return diff;
    });
  }

  isSameDirection(tiebreakers: PlayerStatTiebreaker[], sort?: Sort): boolean {
    let sameDirection = true;
    if (sort && sort.direction !== '') {
      sameDirection = sort.direction === tiebreakers.find((t) => t.attr.includes(sort.active)).sortDirection;
    }
    return sameDirection;
  }

  getAttr(player: Player, tiebreaker: PlayerStatTiebreaker): any {
    let attr = player[tiebreaker.attr] ?? 0;
    if (tiebreaker.nestedAttr != null) {
      attr = attr[tiebreaker.nestedAttr] ?? 0;
    }
    return attr;
  }

  subscribeAndUpdateStatus(updateObject: Entry | Player | Team, observable: Observable<any>): void {
    observable.subscribe({
      next: () => {
        this.updateStatus(updateObject, true);
      },
      error: () => {
        this.updateStatus(updateObject, false);
      }
    });
  }

  updateStatus(updateObject: Entry | Player | Team, isSuccess: boolean): void {
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
