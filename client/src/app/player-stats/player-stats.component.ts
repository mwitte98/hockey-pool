import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EntriesService } from '../shared/services/entries.service';
import { SettingsService } from '../shared/services/settings.service';
import { UserService } from '../shared/services/user.service';
import { UtilService } from '../shared/services/util.service';
import { ApiResponse, Player, PlayerStatColumn, Team, User } from '../shared/types/interfaces';

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
  selectedPlayers: Set<number>;
  teamsRemaining = 0;
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
    private entriesService: EntriesService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.userService.currentUser.subscribe((user: User) => {
      if (user !== undefined && !this.settingsService.setting.is_playoffs_started) {
        this.router.navigateByUrl('/entry/new').catch();
        this.loading = false;
      } else if (user !== undefined) {
        this.entriesService.get().subscribe((response: ApiResponse) => {
          const players = response.players.map((player: Player) => {
            const team = response.teams.find((t) => t.id === player.team_id);
            player.team = { abbr: team.abbr, is_eliminated: team.is_eliminated } as any;
            return player;
          });
          this.originalSkaters = players.filter((p) => p.position !== 'Goalie');
          this.originalGoalies = players.filter((p) => p.position === 'Goalie');
          this.teamsRemaining = response.teams.filter((t) => !t.is_eliminated).length;
          this.selectedPlayers = new Set(
            [].concat.apply(
              [],
              response.entries.map((entry) => entry.player_ids)
            )
          );
          this.updateShownPlayers();
          this.loading = false;
        });
      }
    });
  }

  trackById(_index: number, team: Team): number {
    return team.id;
  }

  updateShownPlayers(): void {
    this.shownSkaters = this.applyFilters(this.originalSkaters);
    this.shownGoalies = this.applyFilters(this.originalGoalies);
  }

  applyFilters(originalPlayers: Player[]): Player[] {
    return originalPlayers
      .filter((p) => !this.showingSelectedPlayers || this.selectedPlayers.has(p.id))
      .filter((p) => this.showingEliminatedPlayers || !p.team.is_eliminated)
      .filter((p) => !this.showingPlayersWithPoints || p.points > 0);
  }
}
