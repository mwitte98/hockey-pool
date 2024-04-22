import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass, NgOptimizedImage, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { EntriesService } from '../shared/services/entries.service';
import { SettingsService } from '../shared/services/settings.service';
import { TeamsService } from '../shared/services/teams.service';
import { UserService } from '../shared/services/user.service';
import { UtilService } from '../shared/services/util.service';
import { DisplayEntry, HomePlayer, HomeTeam, User } from '../shared/types/interfaces';

import { BestEntryService } from './best-entry.service';

@Component({
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', paddingTop: '0', paddingBottom: '0' })),
      state('expanded', style({ height: '*', paddingTop: '8px', paddingBottom: '8px' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinner,
    MatSlideToggle,
    MatTableModule,
    NgClass,
    NgOptimizedImage,
    NgTemplateOutlet,
    SlicePipe,
  ],
})
export class HomeComponent implements OnInit {
  entries: DisplayEntry[];
  teams: HomeTeam[];
  players: Record<string, HomePlayer>;
  tableData: DisplayEntry[];
  columnsToDisplay = ['name', 'points', 'pointsD', 'pointsG', 'pointsC', 'pointsW', 'totalGoals'];
  loading = false;
  expandedEntries: string[];
  showingAllEntries = false;
  showingEliminatedTeams = false;

  constructor(
    private router: Router,
    private entriesService: EntriesService,
    private teamsService: TeamsService,
    private settingsService: SettingsService,
    private userService: UserService,
    private utilService: UtilService,
    private bestEntryService: BestEntryService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.userService.currentUser.subscribe((user: User) => {
      if (user !== undefined && !this.settingsService.setting.isPlayoffsStarted) {
        this.router.navigateByUrl('/entry/new').catch();
        this.loading = false;
      } else if (user !== undefined) {
        forkJoin({ entries: this.entriesService.getDisplay(), teams: this.teamsService.getHome() }).subscribe({
          next: ({ entries, teams }) => {
            this.expandedEntries = [];
            this.entries = entries;
            this.teams = teams;
            this.players = {};
            for (const team of teams) {
              for (const player of team.players) {
                this.players[player.id] = player;
              }
            }
            this.calculatePoints();
            this.utilService.sortEntries(this.entries);
            const bestEntry = this.bestEntryService.determineBestEntry(teams);
            if (bestEntry != null) {
              this.entries.unshift(bestEntry);
            }
            this.prepareTableData();
            this.loading = false;
          },
        });
      }
    });
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

  isExpanded(entry: DisplayEntry): boolean {
    return this.expandedEntries.includes(entry.name);
  }

  toggleAllPanels(): void {
    this.expandedEntries = this.showingAllEntries ? this.entries.map((entry) => entry.name) : [];
  }

  getLogoUrl(team: HomeTeam): string {
    return `https://assets.nhle.com/logos/nhl/svg/${team.abbr}_light.svg`;
  }

  getSelectedPlayerForTeam(selectedPlayerIds: string[], team: HomeTeam): HomePlayer {
    return team.players.find((player) => selectedPlayerIds.includes(player.id));
  }

  prepareTableData(event?: KeyboardEvent): void {
    const filter = event == null ? '' : (event.target as HTMLInputElement).value.toLowerCase();
    this.tableData = [];
    for (const entry of this.entries) {
      let displayEntry = false;
      if (entry.name.toLowerCase().includes(filter) || entry.contestantName.toLowerCase().includes(filter)) {
        displayEntry = true;
      }
      if (!displayEntry) {
        const playerFiltered = entry.playerIds.some((playerId) => {
          const player = this.players[playerId];
          return player.firstName.toLowerCase().includes(filter) || player.lastName.toLowerCase().includes(filter);
        });
        if (playerFiltered) displayEntry = true;
      }
      if (displayEntry) {
        this.tableData.push(entry, { isDetailRow: true, ...entry });
      }
    }
  }

  calculatePoints(): void {
    for (const entry of this.entries) {
      this.resetEntryPoints(entry);
      for (const team of this.teams) {
        const player = this.getSelectedPlayerForTeam(entry.playerIds, team);
        entry.points += player.points ?? 0;
        entry.totalGoals += player.goals ?? 0;
        entry[`points${player.position.charAt(0)}`] += player.points ?? 0;
      }
    }
  }

  resetEntryPoints(entry: DisplayEntry): void {
    entry.points = 0;
    entry.pointsD = 0;
    entry.pointsG = 0;
    entry.pointsC = 0;
    entry.pointsW = 0;
    entry.totalGoals = 0;
    entry.tiebreaker = 0;
  }
}
