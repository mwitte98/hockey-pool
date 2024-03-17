import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PlayersService } from '../../shared/services/players.service';
import { TeamsService } from '../../shared/services/teams.service';
import { UserService } from '../../shared/services/user.service';
import { UtilService } from '../../shared/services/util.service';
import { AdminPlayer, AdminTeam, User } from '../../shared/types/interfaces';

@Component({
  templateUrl: './admin-teams.component.html',
  styleUrl: './admin-teams.component.scss',
})
export class AdminTeamsComponent implements OnInit {
  teams: AdminTeam[];
  loading = false;

  constructor(
    private router: Router,
    private teamsService: TeamsService,
    private playersService: PlayersService,
    private userService: UserService,
    private utilService: UtilService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user: User) => {
      if (user === null) {
        this.router.navigateByUrl('/').catch();
      } else if (user != null) {
        this.loading = true;
        this.teamsService.get().subscribe((teams: AdminTeam[]) => {
          this.teams = teams;
          this.utilService.sortPlayersAlphabeticallyGoaliesFirst(this.teams);
          for (const team of this.teams) {
            this.createTeamForm(team);
            for (const player of team.players) {
              this.createPlayerForm(player);
            }
          }
          this.loading = false;
        });
      }
    });
  }

  createTeamForm(team: AdminTeam): void {
    team.form = this.fb.nonNullable.group({
      name: [team.name, Validators.required],
      abbr: [team.abbr, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      isEliminated: [team.isEliminated, Validators.required],
      madePlayoffs: [team.madePlayoffs, Validators.required],
      conference: [team.conference, Validators.required],
      rank: [team.rank, [Validators.required, Validators.min(1)]],
    });
  }

  createPlayerForm(player: AdminPlayer): void {
    player.form = this.fb.nonNullable.group({
      firstName: [player.firstName, Validators.required],
      lastName: [player.lastName, Validators.required],
      position: [player.position, Validators.required],
    });
  }

  trackByTeamId(_index: number, team: AdminTeam): number {
    return team.id;
  }

  trackByPlayerId(_index: number, player: AdminPlayer): number {
    return player.id;
  }

  updateTeam(id: number): void {
    const team = this.teams.find((t) => t.id === id);
    team.updateLoading = true;
    const response = this.teamsService.update(team.id, team.form.getRawValue());
    this.utilService.subscribeAndUpdateStatus(team, response);
  }

  updatePlayer(teamId: number, playerId: number): void {
    const team = this.teams.find((t) => t.id === teamId);
    const player = team.players.find((p) => p.id === playerId);
    player.updateLoading = true;
    const response = this.playersService.update(player.id, player.form.getRawValue());
    this.utilService.subscribeAndUpdateStatus(player, response);
  }
}
