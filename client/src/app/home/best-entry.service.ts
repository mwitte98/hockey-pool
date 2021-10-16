import { Injectable } from '@angular/core';

import { SettingsService } from '../shared/services/settings.service';
import { UtilService } from '../shared/services/util.service';
import { ApiResponse, Entry, Player, Team } from '../shared/types/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BestEntryService {
  private bestEntry: Entry;
  private bestEntryName = 'BEST POSSIBLE ENTRY';

  constructor(private settingsService: SettingsService, private utilService: UtilService) {}

  determineBestEntry(response: ApiResponse): Entry {
    const bestPlayers = this.bestPlayers(response);
    if (bestPlayers.length === 0 || bestPlayers[bestPlayers.length - 1][0].points <= 0) {
      return null;
    }

    this.calculateBestEntryBranch(bestPlayers, 0, {
      name: this.bestEntryName,
      bestEntry: true,
      players: [],
      player_ids: [],
      numCenters: 0,
      numWingers: 0,
      numDefensemen: 0,
      numGoalies: 0,
      points: 0,
      pointsC: 0,
      pointsW: 0,
      pointsD: 0,
      pointsG: 0,
      totalGoals: 0
    });
    if (this.bestEntry != null) {
      this.utilService.sortPlayersByTeam(this.bestEntry);
    }
    return this.bestEntry;
  }

  bestPlayers(response: ApiResponse): Player[][] {
    return response.teams
      .map((team: Team) => {
        const players = response.players.filter((player: Player) => team.id === player.team_id);
        return [
          this.utilService.sortPlayersByStats(
            players.filter((player: Player) => player.position === 'Center'),
            this.utilService.skaterTiebreakers
          )[0],
          this.utilService.sortPlayersByStats(
            players.filter((player: Player) => player.position === 'Winger'),
            this.utilService.skaterTiebreakers
          )[0],
          this.utilService.sortPlayersByStats(
            players.filter((player: Player) => player.position === 'Defenseman'),
            this.utilService.skaterTiebreakers
          )[0],
          this.utilService.sortPlayersByStats(
            players.filter((player: Player) => player.position === 'Goalie'),
            this.utilService.goalieTiebreakers
          )[0]
        ].sort((a, b) => b.points - a.points);
      })
      .sort((a, b) => b[0].points - a[0].points);
  }

  calculateBestEntryBranch(list: Player[][], n: number, current: Entry): void {
    if (
      this.maxPointsBelowBest(list, n, current) ||
      this.abovePositionMax(current) ||
      this.belowPositionMin(list, current)
    ) {
      return;
    }

    if (n === list.length) {
      this.updateBestEntry(current);
    } else if (n < list.length) {
      for (const nextPlayer of list[n]) {
        const next = this.createNextEntry(current, nextPlayer);
        this.updateNextPositionStats(next, nextPlayer);
        this.calculateBestEntryBranch(list, n + 1, next);
      }
    }
  }

  maxPointsBelowBest(list: Player[][], n: number, current: Entry): boolean {
    if (this.bestEntry != null) {
      let maxRemainingPoints = 0;
      for (let i = n; i < list.length; i++) {
        maxRemainingPoints += list[i][0].points;
      }
      if (current.points + maxRemainingPoints < this.bestEntry.points) {
        return true;
      }
    }
    return false;
  }

  abovePositionMax(current: Entry): boolean {
    const { setting } = this.settingsService;
    if (
      current.numGoalies > setting.max_goalies ||
      current.numCenters > setting.max_centers ||
      current.numWingers > setting.max_wingers ||
      current.numDefensemen > setting.max_defensemen
    ) {
      return true;
    }
    return false;
  }

  belowPositionMin(list: Player[][], current: Entry): boolean {
    const { setting } = this.settingsService;
    const lengthDiff = list.length - current.players.length;
    if (
      current.numGoalies + lengthDiff < setting.min_goalies ||
      current.numCenters + lengthDiff < setting.min_centers ||
      current.numWingers + lengthDiff < setting.min_wingers ||
      current.numDefensemen + lengthDiff < setting.min_defensemen
    ) {
      return true;
    }
    return false;
  }

  updateBestEntry(current: Entry): void {
    if (this.bestEntry == null || this.compareEntries(this.bestEntry, current) > 0) {
      this.bestEntry = current;
    }
  }

  compareEntries(a: Entry, b: Entry): number {
    const tiebreakers = ['points', 'pointsC', 'pointsW', 'pointsD', 'pointsG', 'totalGoals'];
    let diff = 0;
    for (const tiebreaker of tiebreakers) {
      diff = b[tiebreaker] - a[tiebreaker];
      if (diff !== 0) {
        break;
      }
    }
    return diff;
  }

  createNextEntry(current: Entry, nextPlayer: Player): Entry {
    return {
      name: this.bestEntryName,
      bestEntry: true,
      players: [...current.players, nextPlayer],
      player_ids: [...current.player_ids, nextPlayer.id],
      points: current.points + nextPlayer.points,
      numCenters: current.numCenters,
      numWingers: current.numWingers,
      numDefensemen: current.numDefensemen,
      numGoalies: current.numGoalies,
      pointsC: current.pointsC,
      pointsW: current.pointsW,
      pointsD: current.pointsD,
      pointsG: current.pointsG,
      totalGoals: current.totalGoals + nextPlayer.goals
    };
  }

  updateNextPositionStats(next: Entry, nextPlayer: Player): void {
    switch (nextPlayer.position) {
      case 'Center': {
        next.numCenters += 1;
        next.pointsC += nextPlayer.points;
        break;
      }
      case 'Winger': {
        next.numWingers += 1;
        next.pointsW += nextPlayer.points;
        break;
      }
      case 'Defenseman': {
        next.numDefensemen += 1;
        next.pointsD += nextPlayer.points;
        break;
      }
      default: {
        next.numGoalies += 1;
        next.pointsG += nextPlayer.points;
      }
    }
  }
}
