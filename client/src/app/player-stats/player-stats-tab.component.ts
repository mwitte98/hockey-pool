import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { UtilService } from '../shared/services/util.service';
import { PlayerStatColumn, PlayerStatsPlayer, PlayerStatTiebreaker } from '../shared/types/interfaces';

@Component({
  selector: 'player-stats-tab',
  templateUrl: './player-stats-tab.component.html',
  styleUrls: ['./player-stats-tab.component.scss']
})
export class PlayerStatsTabComponent implements OnChanges, OnInit {
  @Input() players: PlayerStatsPlayer[];
  @Input() isFinals: boolean;
  @Input() columnsToDisplay: string[];
  @Input() tiebreakers: PlayerStatTiebreaker[];
  @Input() playerStatColumns: PlayerStatColumn[];
  dataSource: MatTableDataSource<PlayerStatsPlayer>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private utilService: UtilService) {}

  ngOnInit(): void {
    this.setDataSource();
  }

  ngOnChanges(change: SimpleChanges): void {
    if (!change.firstChange) {
      this.setDataSource();
    }
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource(this.utilService.sortPlayersByStats(this.players, this.tiebreakers));
    this.dataSource.sortingDataAccessor = (player: PlayerStatsPlayer, sortHeader: string): number | string => {
      switch (sortHeader) {
        case 'team':
          return player.team.abbr;
        case 'name':
          return player.lastName;
        default:
          return player[sortHeader];
      }
    };
    this.dataSource.sort = this.sort;
  }

  trackBy(_index: number, col: PlayerStatColumn): string {
    return col.stat;
  }

  sortChange(sort: Sort): void {
    this.players = this.utilService.sortPlayersByStats(this.players, this.tiebreakers, sort);
  }
}
