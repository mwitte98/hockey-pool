import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

import { PlayersService } from '../../shared/services/players.service';
import { TeamsService } from '../../shared/services/teams.service';
import { UserService } from '../../shared/services/user.service';
import { UtilService } from '../../shared/services/util.service';
import { Player, Team, User } from '../../shared/types/interfaces';

@Component({
  templateUrl: './admin-teams.component.html',
  styleUrls: ['./admin-teams.component.scss']
})
export class AdminTeamsComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  teams: Team[];
  loading = false;
  expandedEntries: string[] = [];

  constructor(
    private router: Router,
    private teamsService: TeamsService,
    private playersService: PlayersService,
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
          this.expandedEntries = [];
          this.teams = teams;
          this.teams.map((team: Team) => {
            this.createTeamForm(team);
            team.players.map((player: Player) => {
              this.createPlayerForm(player);
              this.createPlayerFormSubscriber(player);
            });
          });
          this.loading = false;
        });
      }
    });
  }

  createTeamForm(team: Team): void {
    team.form = this.fb.group({
      name: [team.name, Validators.required],
      abbr: [team.abbr, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      isEliminated: [team.is_eliminated, Validators.required]
    });
  }

  createPlayerForm(player: Player): void {
    player.form = this.fb.group({
      firstName: [player.first_name, Validators.required],
      lastName: [player.last_name, Validators.required],
      position: [player.position, Validators.required],
      goals: [player.goals, [Validators.required, Validators.min(0)]],
      assists: [player.assists, [Validators.required, Validators.min(0)]],
      gwg: [player.gwg, [Validators.required, Validators.min(0)]],
      shg: [player.shg, [Validators.required, Validators.min(0)]],
      otg: [player.otg, [Validators.required, Validators.min(0)]],
      wins: [player.wins, [Validators.required, Validators.min(0)]],
      otl: [player.otl, [Validators.required, Validators.min(0)]],
      shutouts: [player.shutouts, [Validators.required, Validators.min(0)]],
      finalsGoals: [player.finals_goals, Validators.min(0)],
      finalsAssists: [player.finals_assists, Validators.min(0)],
      finalsGwg: [player.finals_gwg, Validators.min(0)],
      finalsShg: [player.finals_shg, Validators.min(0)],
      finalsOtg: [player.finals_otg, Validators.min(0)],
      finalsWins: [player.finals_wins, Validators.min(0)],
      finalsOtl: [player.finals_otl, Validators.min(0)],
      finalsShutouts: [player.finals_shutouts, Validators.min(0)],
      points: [{ value: player.points, disabled: true }, [Validators.required, Validators.min(0)]]
    });
  }

  createPlayerFormSubscriber(player: Player): void {
    player.form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe((value: any) => {
        // prettier-ignore
        const pointsHash: any = {
          goals: 2, assists: 1, gwg: 1, shg: 3, otg: 2, wins: 2, otl: 1, shutouts: 4,
          finalsGoals: 2, finalsAssists: 1, finalsGwg: 1, finalsShg: 3, finalsOtg: 2,
          finalsWins: 2, finalsOtl: 1, finalsShutouts: 4
        };
        let totalPoints = 0;
        for (const stat of Object.keys(pointsHash)) {
          totalPoints += value[stat] * pointsHash[stat];
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

  afterExpand(teamName: string): void {
    const index = this.expandedEntries.indexOf(teamName);
    if (index === -1) {
      this.expandedEntries.push(teamName);
    }
  }

  afterCollapse(teamName: string): void {
    const index = this.expandedEntries.indexOf(teamName);
    if (index !== -1) {
      this.expandedEntries.splice(index, 1);
    }
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
