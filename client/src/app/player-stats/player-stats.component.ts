import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SettingsService } from '../shared/services/settings.service';
import { TeamsService } from '../shared/services/teams.service';
import { UserService } from '../shared/services/user.service';
import { UtilService } from '../shared/services/util.service';
import { PlayerStatColumn, PlayerStatsPlayer, PlayerStatsTeam, User } from '../shared/types/interfaces';

@Component({
  templateUrl: './player-stats.component.html'
})
export class PlayerStatsComponent implements OnInit {
  loading = false;
  originalSkaters: PlayerStatsPlayer[] = [];
  originalGoalies: PlayerStatsPlayer[] = [];
  shownSkaters: PlayerStatsPlayer[] = [];
  shownGoalies: PlayerStatsPlayer[] = [];
  isFinals = false;
  showingEliminated = false;
  showingSelected = true;

  skaterColumnsToDisplay = ['name', 'goals', 'assists', 'gwg', 'shg', 'otg', 'points'];
  goalieColumnsToDisplay = ['name', 'goals', 'assists', 'wins', 'otl', 'shutouts', 'points'];
  skaterStatColumns: PlayerStatColumn[] = [
    { stat: 'goals', header: 'G' },
    { stat: 'assists', header: 'A' },
    { stat: 'gwg', header: 'GWG' },
    { stat: 'shg', header: 'SHG' },
    { stat: 'otg', header: 'OTG' }
  ];
  goalieStatColumns: PlayerStatColumn[] = [
    { stat: 'goals', header: 'G' },
    { stat: 'assists', header: 'A' },
    { stat: 'wins', header: 'Wins' },
    { stat: 'otl', header: 'OTL' },
    { stat: 'shutouts', header: 'SO' }
  ];

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    public utilService: UtilService,
    private userService: UserService,
    private teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.userService.currentUser.subscribe((user: User) => {
      if (user !== undefined && !this.settingsService.setting.isPlayoffsStarted) {
        this.router.navigateByUrl('/entry/new').catch();
        this.loading = false;
      } else if (user !== undefined) {
        this.teamsService.getPlayerStats().subscribe((teams: PlayerStatsTeam[]) => {
          this.updatePlayers(teams);
          this.loading = false;
        });
      }
    });
  }

  updatePlayers(teams: PlayerStatsTeam[]): void {
    this.originalSkaters = [];
    this.originalGoalies = [];
    this.isFinals = teams.some((team) => team.inFinals);
    for (const team of teams) {
      for (const player of team.players) {
        player.team = { abbr: team.abbr, isEliminated: team.isEliminated, inFinals: team.inFinals } as any;
        if (player.position === 'Goalie') {
          this.originalGoalies.push(player);
        } else {
          this.originalSkaters.push(player);
        }
      }
    }
    this.updateShown();
  }

  updateShown(): void {
    this.shownSkaters = this.applyFilters(this.originalSkaters);
    this.shownGoalies = this.applyFilters(this.originalGoalies);
  }

  applyFilters(originalPlayers: PlayerStatsPlayer[]): PlayerStatsPlayer[] {
    return originalPlayers.filter(
      (p) => (!this.showingSelected || p.isSelected) && (this.showingEliminated || !p.team.isEliminated)
    );
  }
}
