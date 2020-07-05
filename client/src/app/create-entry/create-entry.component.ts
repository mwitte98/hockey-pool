import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(
    private router: Router,
    private entriesService: EntriesService,
    private teamsService: TeamsService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user: User) => {
      if (this.userService.authChecked) {
        if (user == null) {
          this.router.navigateByUrl('/').catch();
        } else {
          this.teamsService.get().subscribe((teams: Team[]) => {
            this.teams = teams;
            this.entryForm = this.fb.group({
              name: ['', Validators.required]
            });
            this.teams.map((team: Team) => {
              this.entryForm.addControl(team.name, new FormControl('', Validators.required));
            });
          });
        }
      }
    });
  }

  trackByTeamId(_index: number, team: Team): number {
    return team.id;
  }

  trackByPlayerId(_index: number, player: Player): number {
    return player.id;
  }

  submitForm(): void {
    const formData = this.entryForm.getRawValue();
    const request: EntryRequest = {
      entry: {
        name: formData['name'],
        player_ids: []
      }
    };
    for (const formField of Object.keys(formData)) {
      if (formField !== 'name') {
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
