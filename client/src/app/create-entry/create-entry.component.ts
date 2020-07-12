import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

import { EntriesService } from '../shared/services/entries.service';
import { TeamsService } from '../shared/services/teams.service';
import { UserService } from '../shared/services/user.service';
import { EntryRequest, Player, Team, User } from '../shared/types/interfaces';

@Component({
  templateUrl: './create-entry.component.html',
  styleUrls: ['./create-entry.component.scss']
})
export class CreateEntryComponent implements OnInit {
  loading = false;
  teams: Team[];
  errors: string[] = [];
  entryForm: FormGroup;
  numbersOfPositions = {
    Center: 0,
    Winger: 0,
    Defenseman: 0,
    Goalie: 0
  };

  constructor(
    private router: Router,
    private entriesService: EntriesService,
    private teamsService: TeamsService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user: User) => {
      if (user === null) {
        this.router.navigateByUrl('/').catch();
      } else if (user != null) {
        this.teamsService.get().subscribe((teams: Team[]) => {
          this.teams = teams;
          this.createEntryForm();
        });
      }
    });
  }

  createEntryForm(): void {
    this.entryForm = this.fb.group(
      {
        name: ['', Validators.required],
        contestantName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      },
      {
        validators: [
          this.positionsValidator('Center', 4, 5),
          this.positionsValidator('Winger', 4, 5),
          this.positionsValidator('Defenseman', 5, 6),
          this.positionsValidator('Goalie', 2, 2)
        ]
      }
    );
    this.teams.map((team: Team) => {
      this.entryForm.addControl(team.name, new FormControl('', Validators.required));
    });
    this.entryForm.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(() => {
        this.setNumbersOfPositions();
        this.entryForm.updateValueAndValidity();
      });
  }

  positionsValidator = (position: string, min: number, max: number): ValidatorFn => {
    return (): ValidationErrors | null => {
      const numberOfPosition = this.numbersOfPositions[position];
      if (numberOfPosition < min || numberOfPosition > max) {
        return { [position]: true };
      }
      return null;
    };
  };

  trackByTeamId(_index: number, team: Team): number {
    return team.id;
  }

  trackByPlayerId(_index: number, player: Player): number {
    return player.id;
  }

  setNumbersOfPositions(): void {
    const numbersOfPositions = {
      Center: 0,
      Winger: 0,
      Defenseman: 0,
      Goalie: 0
    };
    const formData = this.entryForm.getRawValue();
    for (const formField of Object.keys(formData)) {
      if (formField !== 'name' && formField !== 'contestantName' && formField !== 'email') {
        const team = this.teams.find((t) => t.name === formField);
        const player = team.players.find((p) => p.id === formData[formField]);
        if (player) {
          numbersOfPositions[player.position]++;
        }
      }
    }
    this.numbersOfPositions = numbersOfPositions;
  }

  submitForm(): void {
    const formData = this.entryForm.getRawValue();
    const request: EntryRequest = {
      entry: {
        name: formData['name'],
        contestant_name: formData['contestantName'],
        email: formData['email'],
        player_ids: []
      }
    };
    for (const formField of Object.keys(formData)) {
      if (formField !== 'name' && formField !== 'contestantName' && formField !== 'email') {
        request.entry.player_ids.push(formData[formField]);
      }
    }
    this.entriesService.create(request).subscribe(
      () => {
        this.router.navigateByUrl('/admin/entries').catch();
      },
      (error: HttpErrorResponse) => {
        this.errors = error.error.errors;
      }
    );
  }
}
