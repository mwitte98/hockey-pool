import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { EntriesService } from '../../shared/services/entries.service';
import { TeamsService } from '../../shared/services/teams.service';
import { UserService } from '../../shared/services/user.service';
import { UtilService } from '../../shared/services/util.service';
import { Entry, UpsertEntryPlayer, UpsertEntryTeam, User } from '../../shared/types/interfaces';

@Component({
  templateUrl: './admin-entries.component.html',
  styleUrls: ['./admin-entries.component.scss']
})
export class AdminEntriesComponent implements OnInit {
  entries: Entry[];
  teams: UpsertEntryTeam[];
  loading = false;

  constructor(
    private router: Router,
    private entriesService: EntriesService,
    private teamsService: TeamsService,
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
        forkJoin({ entries: this.entriesService.get(), teams: this.teamsService.getUpsertEntry() }).subscribe({
          next: ({ entries, teams }) => {
            this.teams = teams;
            this.entries = entries;
            for (const entry of this.entries) {
              this.createEntryForm(entry);
            }
            this.loading = false;
          }
        });
      }
    });
  }

  trackByEntryId(_index: number, entry: Entry): number {
    return entry.id;
  }

  trackByTeamName(_index: number, team: UpsertEntryTeam): string {
    return team.name;
  }

  trackByPlayerId(_index: number, player: UpsertEntryPlayer): number {
    return player.id;
  }

  createEntryForm(entry: Entry): void {
    entry.form = this.fb.group({
      name: [entry.name, Validators.required],
      contestantName: [entry.contestantName, Validators.required],
      email: [entry.email, [Validators.required, Validators.email]]
    });
    for (const team of this.teams) {
      const teamPlayerIds = new Set(team.players.map((player) => player.id));
      entry.form.addControl(
        team.name,
        new FormControl(this.getSelectedPlayerForTeam(entry.playerIds, teamPlayerIds), Validators.required)
      );
    }
  }

  getSelectedPlayerForTeam(selectedPlayerIds: number[], teamPlayerIds: Set<number>): number {
    return selectedPlayerIds.find((selectedPlayerId) => teamPlayerIds.has(selectedPlayerId));
  }

  goToCreateEntry(): void {
    this.router.navigateByUrl('/entry/new').catch();
  }

  updateEntry(id: number): void {
    const entry = this.entries.find((e: Entry) => e.id === id);
    const formData = entry.form.getRawValue();
    const request: Entry = {
      name: formData.name,
      contestantName: formData.contestantName,
      email: formData.email,
      playerIds: []
    };
    for (const formField of Object.keys(formData)) {
      if (formField !== 'name' && formField !== 'contestantName' && formField !== 'email') {
        request.playerIds.push(formData[formField]);
      }
    }
    entry.updateLoading = true;
    const response = this.entriesService.update(entry.id, request);
    this.utilService.subscribeAndUpdateStatus(entry, response);
  }
}
