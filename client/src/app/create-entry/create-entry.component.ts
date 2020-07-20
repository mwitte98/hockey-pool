import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

import { EntriesService } from '../shared/services/entries.service';
import { SettingsService } from '../shared/services/settings.service';
import { UserService } from '../shared/services/user.service';
import { ApiResponse, Entry, Player, Team, User } from '../shared/types/interfaces';

import { DuplicateEntryDialogComponent } from './duplicate-entry-dialog.component';
import { EntrySubmittedDialogComponent } from './entry-submitted-dialog.component';
import { SeeRulesDialogComponent } from './see-rules-dialog.component';

@Component({
  templateUrl: './create-entry.component.html',
  styleUrls: ['./create-entry.component.scss']
})
export class CreateEntryComponent implements OnInit {
  loading = false;
  teams: Team[];
  entries: Entry[];
  errors: string[] = [];
  entryForm: FormGroup;
  numbersOfPositions = {
    Center: 0,
    Winger: 0,
    Defenseman: 0,
    Goalie: 0
  };

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private entriesService: EntriesService,
    private settingsService: SettingsService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user: User) => {
      if (user === null && this.settingsService.setting.is_playoffs_started) {
        this.router.navigateByUrl('/').catch();
      } else if (user != null || (user === null && !this.settingsService.setting.is_playoffs_started)) {
        this.entriesService.get().subscribe((response: ApiResponse) => {
          this.entries = response.entries;
          response.teams.map((team: Team) => {
            team.players = response.players
              .filter((player: Player) => team.id === player.team_id)
              .sort((a, b) => (a.last_name > b.last_name ? 1 : -1));
          });
          this.teams = response.teams;
          this.createEntryForm();
        });
      }
    });
  }

  createEntryForm(): void {
    const setting = this.settingsService.setting;
    this.entryForm = this.fb.group(
      {
        name: ['', Validators.required],
        contestantName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      },
      {
        validators: [
          this.positionsValidator('Center', setting.min_centers, setting.max_centers),
          this.positionsValidator('Winger', setting.min_wingers, setting.max_wingers),
          this.positionsValidator('Defenseman', setting.min_defensemen, setting.max_defensemen),
          this.positionsValidator('Goalie', setting.min_goalies, setting.max_goalies)
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

  submitForm(fgd: FormGroupDirective): void {
    this.loading = true;
    const request = this.createEntryRequest();
    request.player_ids.sort();
    const requestPlayerIds = request.player_ids;
    const duplicateEntry = this.entries.find((e) => {
      e.player_ids.sort();
      return e.player_ids.every((id, i) => id === requestPlayerIds[i]);
    });
    if (duplicateEntry != null) {
      const duplicateEntryDialog = this.dialog.open(DuplicateEntryDialogComponent, {
        autoFocus: false,
        disableClose: true
      });
      duplicateEntryDialog.afterClosed().subscribe((buttonClicked: string) => {
        if (buttonClicked === 'submit') {
          this.createEntry(request, fgd);
        } else {
          this.loading = false;
        }
      });
    } else {
      this.createEntry(request, fgd);
    }
  }

  createEntryRequest(): Entry {
    const formData = this.entryForm.getRawValue();
    const request: Entry = {
      name: formData['name'],
      contestant_name: formData['contestantName'],
      email: formData['email'],
      player_ids: []
    };
    for (const formField of Object.keys(formData)) {
      if (formField !== 'name' && formField !== 'contestantName' && formField !== 'email') {
        request.player_ids.push(formData[formField]);
      }
    }
    return request;
  }

  createEntry(request: Entry, fgd: FormGroupDirective): void {
    this.entriesService.create(request).subscribe(
      () => {
        const entrySubmittedDialog = this.dialog.open(EntrySubmittedDialogComponent, {
          autoFocus: false
        });
        entrySubmittedDialog.afterClosed().subscribe(() => {
          this.entries.push(request);
          this.entryForm.reset();
          fgd.resetForm();
        });
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        this.loading = false;
      }
    );
  }

  seeRules(): void {
    this.dialog.open(SeeRulesDialogComponent, {
      autoFocus: false
    });
  }
}
