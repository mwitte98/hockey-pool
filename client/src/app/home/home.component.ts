import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { EntriesService } from '../shared/services/entries.service';
import { ApiResponse, Entry, Player } from '../shared/types/interfaces';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class HomeComponent implements OnInit {
  entries: Entry[];
  tableData: Entry[];
  columnsToDisplay = ['name', 'points', 'pointsC', 'pointsW', 'pointsD', 'pointsG', 'totalGoals'];
  loading = false;
  expandedEntries: string[];
  showingAllEntries = false;
  showingEliminatedTeams = false;

  constructor(
    private entriesService: EntriesService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.entriesService.get().subscribe((response: ApiResponse) => {
      this.expandedEntries = [];
      this.combineApiResponseData(response);
      this.calculatePoints();
      this.sortEntries();
      this.prepareTableData();
      this.loading = false;
    });
  }

  trackById(_index: number, player: Player): number {
    return player.id;
  }

  isExpansionDetailRow(_: any, row: any): boolean {
    return row.isDetailRow;
  }

  toggleExpansion(entryName: string): void {
    const index = this.expandedEntries.indexOf(entryName);
    if (index === -1) {
      this.expandedEntries.push(entryName);
    } else {
      this.expandedEntries.splice(index, 1);
    }
  }

  toggleAllPanels(): void {
    this.expandedEntries = this.showingAllEntries ? this.entries.map((entry) => entry.name) : [];
  }

  combineApiResponseData(response: ApiResponse): void {
    const players = response.players;
    players.map((p) => p.team = response.teams.find((t) => t.id === p.team_id));
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
    this.entries = response.entries;
  }

  prepareTableData(): void {
    this.tableData = [];
    this.entries.map((entry: Entry) => {
      this.tableData.push(entry);
      this.tableData.push({isDetailRow: true, ...entry});
    });
  }

  calculatePoints(): void {
    this.entries.map((entry: Entry) => {
      entry.points = entry.pointsC = entry.pointsW = entry.pointsD = entry.pointsG =
        entry.totalGoals = entry.tiebreaker = 0;
      entry.players.map((player: Player) => {
        entry.points += player.points;
        entry.totalGoals += player.goals;
        switch (player.position) {
          case 'Center': {
            entry.pointsC += player.points;
            break;
          }
          case 'Winger': {
            entry.pointsW += player.points;
            break;
          }
          case 'Defenseman': {
            entry.pointsD += player.points;
            break;
          }
          default: {
            entry.pointsG += player.points;
          }
        }
      });
    });
  }

  sortEntries(): void {
    this.entries.sort((a: Entry, b: Entry) => this.compareEntries(a, b));

    this.entries.map((entry: Entry, index: number) => {
      if (index === 0) {
        entry.rank = 1;
        return;
      }
      if (entry.tiebreaker < 6) {
        entry.rank = index + 1;
        return;
      }

      const prevEntry: Entry = this.entries[index - 1];
      entry.rank = this.equals(entry, prevEntry) ? prevEntry.rank : index + 1;
    });
  }

  equals(a: Entry, b: Entry): boolean {
    return a.points === b.points &&
      a.pointsC === b.pointsC &&
      a.pointsW === b.pointsW &&
      a.pointsD === b.pointsD &&
      a.pointsG === b.pointsG &&
      a.totalGoals === b.totalGoals;
  }

  compareEntries(a: Entry, b: Entry): number {
    const tiebreakers = ['points', 'pointsC', 'pointsW', 'pointsD', 'pointsG', 'totalGoals'];
    let diff = 0;
    for (let index = 0; index < tiebreakers.length; index++) {
      const tiebreaker = tiebreakers[index];
      diff = b[tiebreaker] - a[tiebreaker];
      if (diff !== 0) { break; }
      this.setTiebreaker(a, index + 1);
      this.setTiebreaker(b, index + 1);
    }
    return diff;
  }

  setTiebreaker(entry: Entry, newTiebreaker: number): void {
    if (entry.tiebreaker < newTiebreaker) { entry.tiebreaker = newTiebreaker; }
  }
}
