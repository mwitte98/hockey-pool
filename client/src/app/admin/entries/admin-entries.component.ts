import { SlicePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { EntriesService } from '../../shared/services/entries.service';
import { TeamsService } from '../../shared/services/teams.service';
import { UserService } from '../../shared/services/user.service';
import { UtilService } from '../../shared/services/util.service';
import { TelephoneInputComponent } from '../../shared/telephone-input/telephone-input.component';
import { AdminEntry, TelephoneNumber, UpsertEntryTeam, User } from '../../shared/types/interfaces';

@Component({
  templateUrl: './admin-entries.component.html',
  styleUrl: './admin-entries.component.scss',
  standalone: true,
  imports: [
    MatAccordion,
    MatButton,
    MatExpansionPanel,
    MatExpansionPanelContent,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatProgressSpinner,
    MatSelect,
    ReactiveFormsModule,
    SlicePipe,
    TelephoneInputComponent,
  ],
})
export class AdminEntriesComponent implements OnInit {
  entries: AdminEntry[];
  teams: UpsertEntryTeam[];
  loading = false;

  constructor(
    private router: Router,
    private entriesService: EntriesService,
    private teamsService: TeamsService,
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
        forkJoin({ entries: this.entriesService.get(), teams: this.teamsService.getUpsertEntry() }).subscribe({
          next: ({ entries, teams }) => {
            this.teams = teams;
            this.utilService.sortPlayersAlphabeticallyGoaliesFirst(this.teams);
            this.entries = entries;
            for (const entry of this.entries) {
              this.createEntryForm(entry);
            }
            this.loading = false;
          },
        });
      }
    });
  }

  createEntryForm(entry: AdminEntry): void {
    entry.form = this.fb.nonNullable.group({
      name: [entry.name, Validators.required],
      contestantName: [entry.contestantName, Validators.required],
      email: [entry.email, [Validators.required, Validators.email]],
      telephoneNumber: [entry.telephoneNumber, Validators.required],
    });
    for (const team of this.teams) {
      const teamPlayerIds = new Set(team.players.map((player) => player.id));
      entry.form.addControl(
        team.name,
        new FormControl(this.getSelectedPlayerForTeam(entry.playerIds, teamPlayerIds), Validators.required),
      );
    }
  }

  getSelectedPlayerForTeam(selectedPlayerIds: string[], teamPlayerIds: Set<string>): string {
    return selectedPlayerIds.find((selectedPlayerId) => teamPlayerIds.has(selectedPlayerId));
  }

  goToCreateEntry(): void {
    this.router.navigateByUrl('/entry/new').catch();
  }

  updateEntry(id: number): void {
    const entry = this.entries.find((e: AdminEntry) => e.id === id);
    const formData = entry.form.getRawValue();
    const request: AdminEntry = {
      id,
      name: formData.name as string,
      contestantName: formData.contestantName as string,
      email: formData.email as string,
      telephoneNumber: formData.telephoneNumber as TelephoneNumber,
      playerIds: [],
    };
    for (const formField of Object.keys(formData)) {
      if (
        formField !== 'name' &&
        formField !== 'contestantName' &&
        formField !== 'email' &&
        formField !== 'telephoneNumber'
      ) {
        request.playerIds.push(formData[formField] as string);
      }
    }
    entry.updateLoading = true;
    const response = this.entriesService.update(entry.id, request);
    this.utilService.subscribeAndUpdateStatus(entry, response);
  }
}
