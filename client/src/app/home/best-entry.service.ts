import { Injectable } from '@angular/core';

import { SettingsService } from '../shared/services/settings.service';
import { UtilService } from '../shared/services/util.service';
import { ApiResponse, Entry, Player, Team } from '../shared/types/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BestEntryService {
  private bestEntry: Entry;

  constructor(private settingsService: SettingsService, private utilService: UtilService) {}

  determineBestEntry(response: ApiResponse): Entry {
    const bestPlayers = response.teams
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
    this.combos(bestPlayers, 0, {
      name: 'BEST POSSIBLE ENTRY',
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
    this.utilService.sortPlayersByTeam(this.bestEntry);
    return this.bestEntry;
  }

  sortBestEntryPlayers(): void {
    this.bestEntry.players.sort((a: Player, b: Player) => {
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

  combos(list: Player[][], n: number, current: Entry): void {
    if (
      this.maxPointsBelowBest(list, n, current) ||
      this.abovePositionMax(current) ||
      this.belowPositionMin(list, current)
    ) {
      return null;
    }

    if (n === list.length) {
      this.updateBestEntry(current);
    } else if (n < list.length) {
      list[n].map((item: Player) => {
        const next: Entry = {
          name: 'BEST POSSIBLE ENTRY',
          bestEntry: true,
          players: [...current.players, item],
          player_ids: [...current.player_ids, item.id],
          points: current.points + item.points,
          numCenters: current.numCenters,
          numWingers: current.numWingers,
          numDefensemen: current.numDefensemen,
          numGoalies: current.numGoalies,
          pointsC: current.pointsC,
          pointsW: current.pointsW,
          pointsD: current.pointsD,
          pointsG: current.pointsG,
          totalGoals: current.totalGoals + item.goals
        };
        switch (item.position) {
          case 'Center': {
            next.numCenters += 1;
            next.pointsC += item.points;
            break;
          }
          case 'Winger': {
            next.numWingers += 1;
            next.pointsW += item.points;
            break;
          }
          case 'Defenseman': {
            next.numDefensemen += 1;
            next.pointsD += item.points;
            break;
          }
          default: {
            next.numGoalies += 1;
            next.pointsG += item.points;
          }
        }
        this.combos(list, n + 1, next);
      });
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
    const setting = this.settingsService.setting;
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
    const setting = this.settingsService.setting;
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
}
