import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EntriesService } from '../shared/services/entries.service';
import { SettingsService } from '../shared/services/settings.service';
import { UserService } from '../shared/services/user.service';
import { UtilService } from '../shared/services/util.service';
import { ApiResponse, Entry, Player, User } from '../shared/types/interfaces';

import { BestEntryService } from './best-entry.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
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
    private router: Router,
    private entriesService: EntriesService,
    private settingsService: SettingsService,
    private userService: UserService,
    private utilService: UtilService,
    private bestEntryService: BestEntryService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.userService.currentUser.subscribe((user: User) => {
      if (user !== undefined && !this.settingsService.setting.is_playoffs_started) {
        this.router.navigateByUrl('/entry/new').catch();
        this.loading = false;
      } else if (user !== undefined) {
        this.entriesService.get().subscribe((response: ApiResponse) => {
          this.expandedEntries = [];
          this.entries = this.utilService.combineApiResponseData(response);
          this.calculatePoints();
          this.sortEntries();
          const bestEntry = this.bestEntryService.determineBestEntry(response);
          if (bestEntry != null) {
            this.entries.unshift(bestEntry);
          }
          this.prepareTableData();
          this.loading = false;
        });
      }
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

  isExpanded(entry: Entry): boolean {
    return this.expandedEntries.includes(entry.name);
  }

  toggleAllPanels(): void {
    this.expandedEntries = this.showingAllEntries ? this.entries.map((entry) => entry.name) : [];
  }

  prepareTableData(): void {
    this.tableData = [];
    for (const entry of this.entries) {
      this.tableData.push(entry, { isDetailRow: true, ...entry });
    }
  }

  calculatePoints(): void {
    for (const entry of this.entries) {
      this.resetEntryPoints(entry);
      for (const player of entry.players) {
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
      }
    }
  }

  resetEntryPoints(entry: Entry): void {
    entry.points = 0;
    entry.pointsC = 0;
    entry.pointsW = 0;
    entry.pointsD = 0;
    entry.pointsG = 0;
    entry.totalGoals = 0;
    entry.tiebreaker = 0;
  }

  sortEntries(): void {
    this.entries.sort((a: Entry, b: Entry) => this.compareEntries(a, b));

    for (const [index, entry] of this.entries.entries()) {
      if (index === 0) {
        entry.rank = 1;
        continue;
      }
      if (entry.tiebreaker < 6) {
        entry.rank = index + 1;
        continue;
      }

      const prevEntry: Entry = this.entries[index - 1];
      entry.rank = this.equals(entry, prevEntry) ? prevEntry.rank : index + 1;
    }
  }

  equals(a: Entry, b: Entry): boolean {
    return (
      a.points === b.points &&
      a.pointsC === b.pointsC &&
      a.pointsW === b.pointsW &&
      a.pointsD === b.pointsD &&
      a.pointsG === b.pointsG &&
      a.totalGoals === b.totalGoals
    );
  }

  compareEntries(a: Entry, b: Entry): number {
    const tiebreakers = ['points', 'pointsC', 'pointsW', 'pointsD', 'pointsG', 'totalGoals'];
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

  setTiebreaker(entry: Entry, nextTiebreaker: number): void {
    if (entry.tiebreaker < nextTiebreaker) {
      entry.tiebreaker = nextTiebreaker;
    }
  }
}
