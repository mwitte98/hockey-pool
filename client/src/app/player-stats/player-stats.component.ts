import { Component, OnInit } from '@angular/core';

import { TeamsService } from '../shared/services/teams.service';
import { Team } from '../shared/types/interfaces';

@Component({
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss']
})
export class PlayerStatsComponent implements OnInit {
  teams: Team[];
  playerColumnsToDisplay = ['name', 'position', 'goals', 'assists', 'gwg', 'shg', 'otg', 'points'];
  goalieColumnsToDisplay = [
    'name',
    'position',
    'goals',
    'assists',
    'wins',
    'otl',
    'shutouts',
    'points'
  ];
  loading = false;

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void {
    this.loading = true;
    this.teamsService.get().subscribe((teams: Team[]) => {
      teams.map((team: Team) => {
        team.goalies = team.players.filter((p) => p.position === 'Goalie');
        team.players = team.players.filter((p) => p.position !== 'Goalie');
      });
      this.teams = teams;
      this.loading = false;
    });
  }

  trackById(_index: number, team: Team): number {
    return team.id;
  }
}
