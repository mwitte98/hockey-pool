import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SettingsService } from '../shared/services/settings.service';
import { TeamsService } from '../shared/services/teams.service';
import { UserService } from '../shared/services/user.service';
import { UtilService } from '../shared/services/util.service';
import { Player, PlayerStatColumn, Team, User } from '../shared/types/interfaces';

@Component({
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss']
})
export class PlayerStatsComponent implements OnInit {
  loading = false;
  originalSkaters: Player[] = [];
  originalGoalies: Player[] = [];
  shownSkaters: Player[] = [];
  shownGoalies: Player[] = [];
  isFinals = false;
  showingEliminatedPlayers = false;
  showingSelectedPlayers = true;
  showingPlayersWithPoints = true;

  skaterColumnsToDisplay = ['name', 'team', 'position', 'goals', 'assists', 'gwg', 'shg', 'otg', 'points'];
  goalieColumnsToDisplay = ['name', 'team', 'position', 'goals', 'assists', 'wins', 'otl', 'shutouts', 'points'];
  skaterStatColumns: PlayerStatColumn[] = [
    { stat: 'goals', header: 'G', colWidth: 38, textWidth: 20, finalsColWidthGtXs: 50, finalsTextWidthGtXs: 35 },
    { stat: 'assists', header: 'A', colWidth: 38, textWidth: 20, finalsColWidthGtXs: 50, finalsTextWidthGtXs: 35 },
    { stat: 'gwg', header: 'GWG', colWidth: 48, textWidth: 30, finalsColWidthGtXs: 66, finalsTextWidthGtXs: 53 },
    { stat: 'shg', header: 'SHG', colWidth: 44, textWidth: 26, finalsColWidthGtXs: 62, finalsTextWidthGtXs: 49 },
    { stat: 'otg', header: 'OTG', colWidth: 44, textWidth: 26, finalsColWidthGtXs: 62, finalsTextWidthGtXs: 49 }
  ];
  goalieStatColumns: PlayerStatColumn[] = [
    { stat: 'goals', header: 'G', colWidth: 38, textWidth: 20, finalsColWidthGtXs: 50, finalsTextWidthGtXs: 35 },
    { stat: 'assists', header: 'A', colWidth: 38, textWidth: 20, finalsColWidthGtXs: 50, finalsTextWidthGtXs: 35 },
    { stat: 'wins', header: 'Wins', colWidth: 48, textWidth: 28, finalsColWidthGtXs: 66, finalsTextWidthGtXs: 53 },
    { stat: 'otl', header: 'OTL', colWidth: 44, textWidth: 24, finalsColWidthGtXs: 62, finalsTextWidthGtXs: 49 },
    { stat: 'shutouts', header: 'SO', colWidth: 44, textWidth: 20, finalsColWidthGtXs: 62, finalsTextWidthGtXs: 42 }
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
        this.teamsService.get('player_stats').subscribe((teams: Team[]) => {
          this.updatePlayers(teams);
          this.loading = false;
        });
      }
    });
  }

  trackById(_index: number, team: Team): number {
    return team.id;
  }

  updatePlayers(teams: Team[]): void {
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
    this.updateShownPlayers();
  }

  updateShownPlayers(): void {
    this.shownSkaters = this.applyFilters(this.originalSkaters);
    this.shownGoalies = this.applyFilters(this.originalGoalies);
  }

  applyFilters(originalPlayers: Player[]): Player[] {
    return originalPlayers.filter(
      (p) =>
        (!this.showingSelectedPlayers || p.isSelected) &&
        (this.showingEliminatedPlayers || !p.team.isEliminated) &&
        (!this.showingPlayersWithPoints || p.points > 0)
    );
  }
}
