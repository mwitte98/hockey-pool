import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SettingsService } from '../shared/services/settings.service';
import { TeamsService } from '../shared/services/teams.service';
import { UserService } from '../shared/services/user.service';
import { Team, User } from '../shared/types/interfaces';

@Component({
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss']
})
export class PlayerStatsComponent implements OnInit {
  teams: Team[];
  playerColumnsToDisplay = ['name', 'position', 'goals', 'assists', 'gwg', 'shg', 'otg', 'points'];
  goalieColumnsToDisplay = ['name', 'position', 'goals', 'assists', 'wins', 'otl', 'shutouts', 'points'];
  loading = false;

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private userService: UserService,
    private teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.userService.currentUser.subscribe((user: User) => {
      if (user !== undefined && !this.settingsService.setting.is_playoffs_started) {
        this.router.navigateByUrl('/entry/new').catch();
        this.loading = false;
      } else if (user !== undefined) {
        this.teamsService.get().subscribe((teams: Team[]) => {
          teams.map((team: Team) => {
            team.goalies = team.players.filter((p) => p.position === 'Goalie');
            team.players = team.players.filter((p) => p.position !== 'Goalie');
          });
          this.teams = teams.filter((team: Team) => team.made_playoffs);
          this.loading = false;
        });
      }
    });
  }

  trackById(_index: number, team: Team): number {
    return team.id;
  }
}
