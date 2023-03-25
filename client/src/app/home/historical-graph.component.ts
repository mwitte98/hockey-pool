import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { EntriesService } from '../shared/services/entries.service';
import { TeamsService } from '../shared/services/teams.service';
import { UserService } from '../shared/services/user.service';
import { UtilService } from '../shared/services/util.service';
import { ChartLine, DisplayEntry, HomeTeam, User } from '../shared/types/interfaces';

@Component({
  templateUrl: './historical-graph.component.html',
  styleUrls: ['./historical-graph.component.scss']
})
export class HistoricalGraphComponent implements OnInit {
  dates: string[] = [];
  teams: HomeTeam[] = [];
  entries: DisplayEntry[] = [];
  chartData: ChartLine[] = [];
  loading = false;
  window = window;

  constructor(
    private router: Router,
    private entriesService: EntriesService,
    private teamsService: TeamsService,
    private userService: UserService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user: User) => {
      if (user === null) {
        this.router.navigateByUrl('/').catch();
      } else if (user != null) {
        this.loading = true;
        forkJoin({ entries: this.entriesService.getDisplay(), teams: this.teamsService.getHome() }).subscribe({
          next: ({ entries, teams }) => {
            this.dates = [
              ...new Set(
                teams.flatMap((team) => team.players.flatMap((player) => player.stats.map((stat) => stat.date)))
              )
            ].sort((a, b) => a.localeCompare(b));
            this.cumulatePlayerStats(teams);
            this.cumulateEntryStats(entries);
            this.sortEntries();
            this.setupChart();
            this.loading = false;
          }
        });
      }
    });
  }

  cumulatePlayerStats(teams: HomeTeam[]): void {
    this.teams = teams.map((team) => {
      return {
        ...team,
        players: team.players.map((player) => {
          let goals = 0;
          let points = 0;
          return {
            ...player,
            stats: this.dates.map((date) => {
              const dateStats = player.stats.find((stat) => stat.date === date);
              goals += dateStats?.goals ?? 0;
              points += dateStats?.points ?? 0;
              return { date, goals, points };
            })
          };
        })
      };
    });
  }

  cumulateEntryStats(entries: DisplayEntry[]): void {
    this.entries = entries.map((entry) => {
      const cumulativeEntry = this.setupCumulativeEntry(entry);
      for (const team of this.teams) {
        const player = team.players.find((p) => cumulativeEntry.playerIds.includes(p.id));
        for (let i = 0; i < this.dates.length; i++) {
          cumulativeEntry.entryDates[i].points += player.stats[i].points;
          cumulativeEntry.entryDates[i].totalGoals += player.stats[i].goals;
          cumulativeEntry.entryDates[i][`points${player.position.charAt(0)}`] += player.stats[i].points;
        }
      }
      return cumulativeEntry;
    });
  }

  setupCumulativeEntry(entry: DisplayEntry): DisplayEntry {
    return {
      ...entry,
      entryDates: this.dates.map((date) => ({
        date,
        points: 0,
        pointsC: 0,
        pointsW: 0,
        pointsD: 0,
        pointsG: 0,
        totalGoals: 0,
        tiebreaker: 0
      }))
    };
  }

  sortEntries(): void {
    for (let i = 0; i < this.dates.length; i++) {
      const entries = this.entries.map((entry) => entry.entryDates[i]);
      this.utilService.sortEntries(entries);
    }
  }

  setupChart(): void {
    this.chartData = this.entries.map((entry) => {
      return {
        name: entry.name,
        series: entry.entryDates.map((entryDate) => ({ name: new Date(entryDate.date), value: entryDate.rank }))
      };
    });
  }
}
