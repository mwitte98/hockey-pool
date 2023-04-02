import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  FormRecord,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { EntriesService } from '../shared/services/entries.service';
import { SettingsService } from '../shared/services/settings.service';
import { TeamsService } from '../shared/services/teams.service';
import { UserService } from '../shared/services/user.service';
import { AdminEntry, UpsertEntryPlayer, UpsertEntryTeam, User } from '../shared/types/interfaces';

import { DuplicateEntryDialogComponent } from './duplicate-entry-dialog.component';
import { EntrySubmittedDialogComponent } from './entry-submitted-dialog.component';
import { SeeRulesDialogComponent } from './see-rules-dialog.component';

@Component({
  templateUrl: './create-entry.component.html',
  styleUrls: ['./create-entry.component.scss']
})
export class CreateEntryComponent implements OnInit {
  loading = false;
  teams: UpsertEntryTeam[];
  entries: string[][] = [];
  errors: string[] = [];
  entryForm: FormRecord<FormControl<number | string>>;
  numbersOfPositions = {
    center: 0,
    winger: 0,
    defenseman: 0,
    goalie: 0
  };

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private teamsService: TeamsService,
    private entriesService: EntriesService,
    private settingsService: SettingsService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user: User) => {
      if (user === null && this.settingsService.setting.isPlayoffsStarted) {
        this.router.navigateByUrl('/').catch();
      } else if (user != null || (user === null && !this.settingsService.setting.isPlayoffsStarted)) {
        forkJoin({ teams: this.teamsService.getUpsertEntry(), entries: this.entriesService.getPlayerIds() }).subscribe({
          next: ({ teams, entries }) => {
            this.teams = teams;
            this.createEntryForm();
            this.entries = entries;
          }
        });
      }
    });
  }

  createEntryForm(): void {
    const { setting } = this.settingsService;
    this.entryForm = this.fb.nonNullable.group(
      {
        name: ['', Validators.required],
        contestantName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      },
      {
        validators: [
          this.positionsValidator('center', setting.minCenters, setting.maxCenters),
          this.positionsValidator('winger', setting.minWingers, setting.maxWingers),
          this.positionsValidator('defenseman', setting.minDefensemen, setting.maxDefensemen),
          this.positionsValidator('goalie', setting.minGoalies, setting.maxGoalies)
        ]
      }
    );
    for (const team of this.teams) {
      this.entryForm.addControl(team.name, new FormControl('', Validators.required));
    }
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

  trackByTeamName(_index: number, team: UpsertEntryTeam): string {
    return team.name;
  }

  trackByPlayerId(_index: number, player: UpsertEntryPlayer): string {
    return player.id;
  }

  setNumbersOfPositions(): void {
    const numbersOfPositions = {
      center: 0,
      winger: 0,
      defenseman: 0,
      goalie: 0
    };
    const formData = this.entryForm.getRawValue();
    for (const formField of Object.keys(formData)) {
      if (formField !== 'name' && formField !== 'contestantName' && formField !== 'email') {
        const team = this.teams.find((t) => t.name === formField);
        const player = team.players.find((p) => p.id === formData[formField]);
        if (player) {
          numbersOfPositions[player.position.toLowerCase()] += 1;
        }
      }
    }
    this.numbersOfPositions = numbersOfPositions;
  }

  submitForm(fgd: FormGroupDirective): void {
    this.loading = true;
    const request = this.createEntryRequest();
    request.playerIds.sort((a, b) => a.localeCompare(b));
    const requestPlayerIds = request.playerIds;
    const duplicateEntry = this.entries.find((e) => {
      e.sort((a, b) => a.localeCompare(b));
      return requestPlayerIds.every((id, i) => id === e[i]);
    });
    if (duplicateEntry == null) {
      this.createEntry(request, fgd);
    } else {
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
    }
  }

  createEntryRequest(): AdminEntry {
    const formData = this.entryForm.getRawValue();
    const request: AdminEntry = {
      name: formData.name as string,
      contestantName: formData.contestantName as string,
      email: formData.email as string,
      playerIds: []
    };
    for (const formField of Object.keys(formData)) {
      if (formField !== 'name' && formField !== 'contestantName' && formField !== 'email') {
        request.playerIds.push(formData[formField] as string);
      }
    }
    return request;
  }

  createEntry(request: AdminEntry, fgd: FormGroupDirective): void {
    this.entriesService.create(request).subscribe({
      next: () => {
        const entrySubmittedDialog = this.dialog.open(EntrySubmittedDialogComponent, { autoFocus: 'dialog' });
        entrySubmittedDialog.afterClosed().subscribe(() => {
          this.entries.push(request.playerIds);
          this.entryForm.reset();
          fgd.resetForm();
        });
        this.errors = [];
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errors = error.error.errors;
        this.loading = false;
      }
    });
  }

  seeRules(): void {
    this.dialog.open(SeeRulesDialogComponent, { autoFocus: 'dialog' });
  }
}
