import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Player, PlayerStatColumn, PlayerStatTiebreaker } from '../shared/types/interfaces';

@Component({
  selector: 'player-stats-tab',
  templateUrl: './player-stats-tab.component.html',
  styleUrls: ['./player-stats-tab.component.scss']
})
export class PlayerStatsTabComponent implements OnChanges, OnInit {
  @Input() players: Player[];
  @Input() teamsRemaining: number;
  @Input() columnsToDisplay: string[];
  @Input() tiebreakers: PlayerStatTiebreaker[];
  @Input() playerStatColumns: PlayerStatColumn[];
  dataSource: MatTableDataSource<Player>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.setDataSource();
  }

  ngOnChanges(change: SimpleChanges): void {
    if (!change.firstChange) {
      this.setDataSource();
    }
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource(this.defaultSort());
    this.dataSource.sortingDataAccessor = (player: Player, sortHeader: string): string | number => {
      switch (sortHeader) {
        case 'team':
          return player.team.abbr;
        case 'name':
          return player.last_name;
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
    this.players = this.defaultSort(sort);
  }

  defaultSort(sort?: Sort): Player[] {
    let sameDirection = true;
    if (sort && sort.direction !== '') {
      sameDirection = sort.direction === this.tiebreakers.find((t) => t.attr.includes(sort.active)).sortDirection;
    }

    return this.players.sort((a, b) => {
      let diff = 0;
      for (const tiebreaker of this.tiebreakers) {
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
}
