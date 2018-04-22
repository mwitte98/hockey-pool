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

  isExpansionDetailRow(_, row): boolean {
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
    if (this.showingAllEntries) {
      this.expandedEntries = this.entries.map((entry) => entry.name);
    } else {
      this.expandedEntries = [];
    }
  }

  combineApiResponseData(response: ApiResponse): void {
    const players = response.players;
    players.forEach((p) => p.team = response.teams.find((t) => t.id === p.team_id));
    response.entries.forEach((entry: Entry) => {
      entry.players = [];
      entry.player_ids.forEach((pId) => entry.players.push(players.find((p) => p.id === pId)));
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
    this.entries.forEach((entry: Entry) => {
      this.tableData.push(entry);
      this.tableData.push({isDetailRow: true, ...entry});
    });
  }

  calculatePoints() {
    this.entries.forEach((entry: Entry) => {
      entry.points = entry.pointsC = entry.pointsW =
        entry.pointsD = entry.pointsG = entry.totalGoals = 0;
      entry.players.forEach((player: Player) => {
        entry.points += player.points;
        entry.totalGoals += player.goals;
        if (player.position === 'Center') {
            entry.pointsC += player.points;
        } else if (player.position === 'Winger') {
            entry.pointsW += player.points;
        } else if (player.position === 'Defenseman') {
            entry.pointsD += player.points;
        } else {
            entry.pointsG += player.points;
        }
      });
    });
  }

  sortEntries(): void {
    this.entries.sort((a: Entry, b: Entry) => this.compareEntries(a, b) );

    this.entries.forEach((entry: Entry, index: number) => {
      if (index === 0) {
        entry.rank = 1;
        return;
      }
      if (!entry.tiebreaker || entry.tiebreaker !== 'Tied') {
        entry.rank = index + 1;
        return;
      }

      const prevEntry: Entry = this.entries[index - 1];
      if (this.equals(entry, prevEntry)) {
            entry.rank = prevEntry.rank;
      } else {
        entry.rank = index + 1;
      }
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
    const pointsDiff = b.points - a.points;
    if (pointsDiff !== 0) { return pointsDiff; }

    this.setTiebreakerC(a);
    this.setTiebreakerC(b);

    const pointsDiffC = b.pointsC - a.pointsC;
    if (pointsDiffC !== 0) { return pointsDiffC; }

    this.setTiebreakerW(a);
    this.setTiebreakerW(b);

    const pointsDiffW = b.pointsW - a.pointsW;
    if (pointsDiffW !== 0) { return pointsDiffW; }

    this.setTiebreakerD(a);
    this.setTiebreakerD(b);

    const pointsDiffD = b.pointsD - a.pointsD;
    if (pointsDiffD !== 0) { return pointsDiffD; }

    this.setTiebreakerG(a);
    this.setTiebreakerG(b);

    const pointsDiffG = b.pointsG - a.pointsG;
    if (pointsDiffG !== 0) { return pointsDiffG; }

    this.setTiebreakerGoals(a);
    this.setTiebreakerGoals(b);

    if (b.totalGoals - a.totalGoals === 0) {
        a.tiebreaker = 'Tied';
        b.tiebreaker = 'Tied';
    }
    return b.totalGoals - a.totalGoals;
  }

  setTiebreakerC(entry: Entry) {
    if (entry.tiebreaker) { return; }
    entry.tiebreaker = 'C';
  }

  setTiebreakerW(entry: Entry) {
    if (entry.tiebreaker === 'C') { entry.tiebreaker = 'W'; }
  }

  setTiebreakerD(entry: Entry) {
    if (entry.tiebreaker === 'C' || entry.tiebreaker === 'W') { entry.tiebreaker = 'D'; }
  }

  setTiebreakerG(entry: Entry) {
    if (entry.tiebreaker !== 'Goals' && entry.tiebreaker !== 'Tied') { entry.tiebreaker = 'G'; }
  }

  setTiebreakerGoals(entry: Entry) {
    if (entry.tiebreaker !== 'Tied') { entry.tiebreaker = 'Goals'; }
  }
}
