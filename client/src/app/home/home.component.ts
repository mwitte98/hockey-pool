import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { EntriesService } from '../shared/services/entries.service';
import { SettingsService } from '../shared/services/settings.service';
import { TeamsService } from '../shared/services/teams.service';
import { UserService } from '../shared/services/user.service';
import { UtilService } from '../shared/services/util.service';
import { DisplayEntry, HomePlayer, HomeTeam, User } from '../shared/types/interfaces';

import { BestEntryService } from './best-entry.service';
import { HistoricalGraphComponent } from './historical-graph.component';

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
  entries: DisplayEntry[];
  teams: HomeTeam[];
  tableData: DisplayEntry[];
  columnsToDisplay = ['name', 'points', 'pointsC', 'pointsW', 'pointsD', 'pointsG', 'totalGoals'];
  loading = false;
  expandedEntries: string[];
  showingAllEntries = false;
  showingEliminatedTeams = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private entriesService: EntriesService,
    private teamsService: TeamsService,
    private settingsService: SettingsService,
    private userService: UserService,
    private utilService: UtilService,
    private bestEntryService: BestEntryService
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
            this.calculatePoints();
            this.utilService.sortEntries(this.entries);
            const bestEntry = this.bestEntryService.determineBestEntry(teams);
            if (bestEntry != null) {
              this.entries.unshift(bestEntry);
            }
            this.prepareTableData();
            this.loading = false;
            // this.openHistoricalGraph();
          }
        });
      }
    });
  }

  trackByTeamId(_index: number, team: HomeTeam): number {
    return team.id;
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

  openHistoricalGraph(): void {
    const entries: DisplayEntry[] = [];
    for (const entry of this.entries) {
      if (!entry.bestEntry) {
        entries.push({ name: entry.name, playerIds: entry.playerIds });
      }
    }
    this.dialog.open(HistoricalGraphComponent, {
      autoFocus: 'dialog',
      height: '95vh',
      width: '95vw',
      maxWidth: '95vw',
      data: { entries, teams: this.teams }
    });
  }

  getLogoUrl(team: HomeTeam): string {
    return `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${team.nhlId}.svg`;
  }

  getSelectedPlayerForTeam(selectedPlayerIds: number[], team: HomeTeam): HomePlayer {
    return team.players.find((player) => selectedPlayerIds.includes(player.id));
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
      for (const team of this.teams) {
        const player = this.getSelectedPlayerForTeam(entry.playerIds, team);
        const { goals, points } = this.getGoalsAndPoints(player);
        entry.points += points;
        entry.totalGoals += goals ?? 0;
        entry[`points${player.position.charAt(0)}`] += points;
      }
    }
  }

  getGoalsAndPoints(player: HomePlayer): { goals: number; points: number } {
    let goals = 0;
    let points = 0;
    for (const stat of player.stats) {
      goals += stat.goals ?? 0;
      points += stat.points;
    }
    return { goals, points };
  }

  resetEntryPoints(entry: DisplayEntry): void {
    entry.points = 0;
    entry.pointsC = 0;
    entry.pointsW = 0;
    entry.pointsD = 0;
    entry.pointsG = 0;
    entry.totalGoals = 0;
    entry.tiebreaker = 0;
  }
}
