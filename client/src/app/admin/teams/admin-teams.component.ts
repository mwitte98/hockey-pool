import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

import { PlayersService } from '../../shared/services/players.service';
import { SettingsService } from '../../shared/services/settings.service';
import { TeamsService } from '../../shared/services/teams.service';
import { UserService } from '../../shared/services/user.service';
import { UtilService } from '../../shared/services/util.service';
import { Player, Team, User } from '../../shared/types/interfaces';

@Component({
  templateUrl: './admin-teams.component.html',
  styleUrls: ['./admin-teams.component.scss']
})
export class AdminTeamsComponent implements OnInit {
  teams: Team[];
  loading = false;

  constructor(
    private router: Router,
    private teamsService: TeamsService,
    private playersService: PlayersService,
    private settingsService: SettingsService,
    private userService: UserService,
    private utilService: UtilService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user: User) => {
      if (user === null) {
        this.router.navigateByUrl('/').catch();
      } else if (user != null) {
        this.loading = true;
        this.teamsService.get().subscribe((teams: Team[]) => {
          this.teams = teams;
          for (const team of this.teams) {
            this.createTeamForm(team);
            for (const player of team.players) {
              this.createPlayerForm(player);
              this.createPlayerFormSubscriber(player);
            }
          }
          this.loading = false;
        });
      }
    });
  }

  createTeamForm(team: Team): void {
    team.form = this.fb.group({
      name: [team.name, Validators.required],
      abbr: [team.abbr, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      isEliminated: [team.isEliminated, Validators.required],
      madePlayoffs: [team.madePlayoffs, Validators.required],
      conference: [team.conference, Validators.required],
      rank: [team.rank, [Validators.required, Validators.min(1)]],
      nhlId: [team.nhlId, [Validators.required, Validators.min(1)]]
    });
  }

  createPlayerForm(player: Player): void {
    player.form = this.fb.group({
      firstName: [player.firstName, Validators.required],
      lastName: [player.lastName, Validators.required],
      position: [player.position, Validators.required],
      goals: [player.goals, [Validators.required, Validators.min(0)]],
      assists: [player.assists, [Validators.required, Validators.min(0)]],
      gwg: [player.gwg, [Validators.required, Validators.min(0)]],
      shg: [player.shg, [Validators.required, Validators.min(0)]],
      otg: [player.otg, [Validators.required, Validators.min(0)]],
      wins: [player.wins, [Validators.required, Validators.min(0)]],
      otl: [player.otl, [Validators.required, Validators.min(0)]],
      shutouts: [player.shutouts, [Validators.required, Validators.min(0)]],
      finalsGoals: [player.finalsGoals, Validators.min(0)],
      finalsAssists: [player.finalsAssists, Validators.min(0)],
      finalsGwg: [player.finalsGwg, Validators.min(0)],
      finalsShg: [player.finalsShg, Validators.min(0)],
      finalsOtg: [player.finalsOtg, Validators.min(0)],
      finalsWins: [player.finalsWins, Validators.min(0)],
      finalsOtl: [player.finalsOtl, Validators.min(0)],
      finalsShutouts: [player.finalsShutouts, Validators.min(0)],
      points: [{ value: player.points, disabled: true }, [Validators.required, Validators.min(0)]]
    });
  }

  createPlayerFormSubscriber(player: Player): void {
    player.form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe((value: any) => {
        let totalPoints = 0;
        for (const formKey of Object.keys(value)) {
          const formValue = value[formKey];
          if (typeof formValue === 'number') {
            totalPoints +=
              formValue * this.settingsService.setting[`points${formKey.charAt(0).toUpperCase()}${formKey.slice(1)}`];
          }
        }
        player.form.patchValue({ points: totalPoints });
      });
  }

  trackByTeamId(_index: number, team: Team): number {
    return team.id;
  }

  trackByPlayerId(_index: number, player: Player): number {
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
