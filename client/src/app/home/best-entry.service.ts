import { Injectable } from '@angular/core';

import { SettingsService } from '../shared/services/settings.service';
import { UtilService } from '../shared/services/util.service';
import { DisplayEntry, HomeTeam, Player } from '../shared/types/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BestEntryService {
  private bestEntry: DisplayEntry;
  private bestEntryName = 'BEST POSSIBLE ENTRY';

  constructor(private settingsService: SettingsService, private utilService: UtilService) {}

  determineBestEntry(teams: HomeTeam[]): DisplayEntry {
    const bestPlayers = this.bestPlayers(teams);
    if (bestPlayers.length === 0 || bestPlayers[bestPlayers.length - 1][0].points <= 0) {
      return null;
    }

    this.calculateBestEntryBranch(bestPlayers, 0, {
      name: this.bestEntryName,
      bestEntry: true,
      playerIds: [],
      numCenter: 0,
      numWinger: 0,
      numDefenseman: 0,
      numGoalie: 0,
      points: 0,
      pointsC: 0,
      pointsW: 0,
      pointsD: 0,
      pointsG: 0,
      totalGoals: 0
    });
    return this.bestEntry;
  }

  bestPlayers(teams: HomeTeam[]): Player[][] {
    return teams
      .map((team: HomeTeam) => {
        return [
          this.utilService.sortPlayersByStats(
            team.players.filter((player: Player) => player.position === 'Center'),
            this.utilService.skaterTiebreakers
          )[0],
          this.utilService.sortPlayersByStats(
            team.players.filter((player: Player) => player.position === 'Winger'),
            this.utilService.skaterTiebreakers
          )[0],
          this.utilService.sortPlayersByStats(
            team.players.filter((player: Player) => player.position === 'Defenseman'),
            this.utilService.skaterTiebreakers
          )[0],
          this.utilService.sortPlayersByStats(
            team.players.filter((player: Player) => player.position === 'Goalie'),
            this.utilService.goalieTiebreakers
          )[0]
        ].sort((a, b) => b.points - a.points);
      })
      .sort((a, b) => b[0].points - a[0].points);
  }

  calculateBestEntryBranch(list: Player[][], n: number, current: DisplayEntry): void {
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

  maxPointsBelowBest(list: Player[][], n: number, current: DisplayEntry): boolean {
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

  abovePositionMax(current: DisplayEntry): boolean {
    const { setting } = this.settingsService;
    return (
      current.numGoalie > setting.maxGoalies ||
      current.numCenter > setting.maxCenters ||
      current.numWinger > setting.maxWingers ||
      current.numDefenseman > setting.maxDefensemen
    );
  }

  belowPositionMin(list: Player[][], current: DisplayEntry): boolean {
    const { setting } = this.settingsService;
    const lengthDiff = list.length - current.playerIds.length;
    return (
      current.numGoalie + lengthDiff < setting.minGoalies ||
      current.numCenter + lengthDiff < setting.minCenters ||
      current.numWinger + lengthDiff < setting.minWingers ||
      current.numDefenseman + lengthDiff < setting.minDefensemen
    );
  }

  updateBestEntry(current: DisplayEntry): void {
    if (this.bestEntry == null || this.compareEntries(this.bestEntry, current) > 0) {
      this.bestEntry = current;
    }
  }

  compareEntries(a: DisplayEntry, b: DisplayEntry): number {
    const tiebreakers = ['points', 'pointsC', 'pointsW', 'pointsD', 'pointsG', 'totalGoals'];
    let diff = 0;
    for (const tiebreaker of tiebreakers) {
      diff = b[tiebreaker] ?? 0 - a[tiebreaker] ?? 0;
      if (diff !== 0) {
        break;
      }
    }
    return diff;
  }

  createNextEntry(current: DisplayEntry, nextPlayer: Player): DisplayEntry {
    return {
      ...current,
      playerIds: [...current.playerIds, nextPlayer.id],
      points: current.points + (nextPlayer.points ?? 0),
      totalGoals: current.totalGoals + (nextPlayer.goals ?? 0)
    };
  }

  updateNextPositionStats(next: DisplayEntry, nextPlayer: Player): void {
    next[`num${nextPlayer.position}`] += 1;
    next[`points${nextPlayer.position.charAt(0)}`] += nextPlayer.points ?? 0;
  }
}
