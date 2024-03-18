import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { SettingsService } from '../shared/services/settings.service';
import { UtilService } from '../shared/services/util.service';
import { PlayerStatColumn, PlayerStatsPlayer, PlayerStatTiebreaker } from '../shared/types/interfaces';

@Component({
  selector: 'player-stats-tab',
  templateUrl: './player-stats-tab.component.html',
  styleUrl: './player-stats-tab.component.scss',
})
export class PlayerStatsTabComponent implements OnChanges, OnInit {
  @Input() players: PlayerStatsPlayer[];
  @Input() columnsToDisplay: string[];
  @Input() tiebreakers: PlayerStatTiebreaker[];
  @Input() playerStatColumns: PlayerStatColumn[];
  dataSource: MatTableDataSource<PlayerStatsPlayer>;
  multipliersToRounds: Map<number, number[]>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private settingsService: SettingsService,
    private utilService: UtilService,
  ) {}

  ngOnChanges(change: SimpleChanges): void {
    if (!change.firstChange) {
      this.setDataSource();
    }
  }

  ngOnInit(): void {
    this.setDataSource();
    const roundsPlayed = [
      ...new Set(this.players.flatMap((player) => player.stats.map((dateStat) => dateStat.round))),
    ].sort((a, b) => a - b);
    this.multipliersToRounds = new Map<number, number[]>();
    for (const round of roundsPlayed) {
      const multiplier = this.settingsService.setting.roundMultipliers[round - 1];
      if (this.multipliersToRounds.has(multiplier)) {
        this.multipliersToRounds.set(multiplier, [...this.multipliersToRounds.get(multiplier), round]);
      } else {
        this.multipliersToRounds.set(multiplier, [round]);
      }
    }
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource(this.utilService.sortPlayersByStats(this.players, this.tiebreakers));
    this.dataSource.sortingDataAccessor = (player: PlayerStatsPlayer, sortHeader: string): number | string => {
      return sortHeader === 'name' ? player.lastName : player[sortHeader];
    };
    this.dataSource.sort = this.sort;
  }

  sortChange(sort: Sort): void {
    this.players = this.utilService.sortPlayersByStats(this.players, this.tiebreakers, sort);
  }

  getPlayerStatCol(player: PlayerStatsPlayer, stat: string): string {
    let statColString: string = player[stat] ?? 0;
    const statCounts = this.getStatCountsByMultiplier(player, stat);
    for (const [index, statCount] of statCounts.entries()) {
      let subsequentCountNotZero = false;
      for (let i = index + 1; i < statCounts.length; i++) {
        if (statCounts[i] > 0) {
          subsequentCountNotZero = true;
          break;
        }
      }
      if (statCount > 0 || subsequentCountNotZero) {
        statColString += ` (${statCount})`;
      }
    }
    return statColString;
  }

  getStatCountsByMultiplier(player: PlayerStatsPlayer, stat: string): number[] {
    const statCounts: number[] = [];
    for (const [multiplier, rounds] of this.multipliersToRounds) {
      if (multiplier <= 1) continue;
      let statCount = 0;
      for (const round of rounds) {
        for (const dateStat of player.stats) {
          if (dateStat.round === round) {
            statCount += dateStat[stat] ?? 0;
          }
        }
      }
      statCounts.push(statCount);
    }
    return statCounts;
  }
}
