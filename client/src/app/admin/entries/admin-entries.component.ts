import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';

import { EntriesService } from '../../shared/services/entries.service';
import { UserService } from '../../shared/services/user.service';
import { UtilService } from '../../shared/services/util.service';
import { ApiResponse, Entry, Player, Team, User } from '../../shared/types/interfaces';

@Component({
  templateUrl: './admin-entries.component.html',
  styleUrls: ['./admin-entries.component.scss']
})
export class AdminEntriesComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  entries: Entry[];
  teams: Team[];
  loading = false;
  expandedEntries: string[] = [];

  constructor(
    private router: Router,
    private entriesService: EntriesService,
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
        this.entriesService.get().subscribe((response: ApiResponse) => {
          this.expandedEntries = [];
          this.setTeamPlayers(response);
          this.entries = this.utilService.combineApiResponseData(response);
          this.entries.map((entry: Entry) => {
            this.createEntryForm(entry);
          });
          this.loading = false;
        });
      }
    });
  }

  trackByEntryId(_index: number, entry: Entry): number {
    return entry.id;
  }

  trackByPlayerId(_index: number, player: Player): number {
    return player.id;
  }

  afterExpand(entryName: string): void {
    const index = this.expandedEntries.indexOf(entryName);
    if (index === -1) {
      this.expandedEntries.push(entryName);
    }
  }

  afterCollapse(entryName: string): void {
    const index = this.expandedEntries.indexOf(entryName);
    if (index !== -1) {
      this.expandedEntries.splice(index, 1);
    }
  }

  setTeamPlayers(response: ApiResponse): void {
    response.teams.map((team: Team) => {
      team.players = response.players.filter((p: Player) => {
        return p.team_id === team.id;
      });
    });
    this.teams = response.teams;
  }

  createEntryForm(entry: Entry): void {
    entry.form = this.fb.group({
      name: [entry.name, Validators.required],
      contestantName: [entry.contestant_name, Validators.required],
      email: [entry.email, [Validators.required, Validators.email]]
    });
    entry.players.map((player: Player) => {
      entry.form.addControl(player.team.name, new FormControl(player.id, Validators.required));
    });
  }

  goToCreateEntry(): void {
    this.router.navigateByUrl('/entry/new').catch();
  }

  updateEntry(id: number): void {
    const entry = this.entries.find((e: Entry) => e.id === id);
    const formData = entry.form.getRawValue();
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
    entry.updateLoading = true;
    const response = this.entriesService.update(entry.id, request);
    this.utilService.subscribeAndUpdateStatus(entry, response);
  }
}
