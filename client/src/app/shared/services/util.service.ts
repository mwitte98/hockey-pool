import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';

import {
  AdminEntry,
  AdminPlayer,
  AdminTeam,
  EntryStats,
  Player,
  PlayerStatTiebreaker,
  UpsertEntryPlayer,
  UpsertEntryTeam,
} from '../types/interfaces';

@Injectable({
  providedIn: 'root',
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
    { attr: 'position', sortDirection: 'asc' },
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
    { attr: 'firstName', sortDirection: 'asc' },
  ];

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

  subscribeAndUpdateStatus(updateObject: AdminEntry | AdminPlayer | AdminTeam, observable: Observable<any>): void {
    observable.subscribe({
      next: () => {
        updateObject.updateLoading = false;
        updateObject.updateSuccess = true;
        setTimeout(() => (updateObject.updateSuccess = false), 3000);
      },
      error: () => {
        updateObject.updateLoading = false;
        updateObject.updateFailure = true;
        setTimeout(() => (updateObject.updateFailure = false), 3000);
      },
    });
  }

  sortEntries(entries: EntryStats[]): void {
    entries.sort((a: EntryStats, b: EntryStats) => this.compareEntries(a, b));

    for (const [index, entry] of entries.entries()) {
      if (index === 0) {
        entry.rank = 1;
        continue;
      }
      if (entry.tiebreaker < 6) {
        entry.rank = index + 1;
        continue;
      }

      const prevEntry: EntryStats = entries[index - 1];
      entry.rank = this.equals(entry, prevEntry) ? prevEntry.rank : index + 1;
    }
  }

  equals(a: EntryStats, b: EntryStats): boolean {
    return (
      a.points === b.points &&
      a.pointsD === b.pointsD &&
      a.pointsG === b.pointsG &&
      a.pointsC === b.pointsC &&
      a.pointsW === b.pointsW &&
      a.totalGoals === b.totalGoals
    );
  }

  compareEntries(a: EntryStats, b: EntryStats): number {
    const tiebreakers = ['points', 'pointsD', 'pointsG', 'pointsC', 'pointsW', 'totalGoals'];
    let diff = 0;
    for (const [index, tiebreaker] of tiebreakers.entries()) {
      diff = b[tiebreaker] - a[tiebreaker];
      if (diff !== 0) {
        break;
      }
      this.setTiebreaker(a, index + 1);
      this.setTiebreaker(b, index + 1);
    }
    return diff;
  }

  setTiebreaker(entry: EntryStats, nextTiebreaker: number): void {
    if (entry.tiebreaker < nextTiebreaker) {
      entry.tiebreaker = nextTiebreaker;
    }
  }

  sortPlayersAlphabeticallyGoaliesFirst(teams: AdminTeam[] | UpsertEntryTeam[]): void {
    for (const team of teams) {
      team.players.sort((a: AdminPlayer | UpsertEntryPlayer, b: AdminPlayer | UpsertEntryPlayer) => {
        if (a.position === 'Goalie' && b.position !== 'Goalie') return -1;
        if (a.position !== 'Goalie' && b.position === 'Goalie') return 1;
        const lastNameCompare = a.lastName.localeCompare(b.lastName);
        return lastNameCompare === 0 ? a.firstName.localeCompare(b.firstName) : lastNameCompare;
      });
    }
  }
}
