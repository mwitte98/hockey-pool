import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SettingsService } from '../../shared/services/settings.service';
import { UserService } from '../../shared/services/user.service';
import { Setting, User } from '../../shared/types/interfaces';

@Component({
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {
  updating = false;
  updateSuccess = false;
  updateFailure = false;
  setting: Setting;
  errors: string[] = [];
  settingForm: FormGroup;

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user: User) => {
      if (user === null) {
        this.router.navigateByUrl('/').catch();
      } else if (user != null) {
        this.settingsService.get().subscribe((setting: Setting) => {
          this.setting = setting;
          this.createSettingForm();
        });
      }
    });
  }

  createSettingForm(): void {
    this.settingForm = this.fb.group({
      is_playoffs_started: [this.setting.is_playoffs_started, Validators.required],
      min_centers: [this.setting.min_centers, [Validators.required, Validators.min(0)]],
      max_centers: [this.setting.max_centers, [Validators.required, Validators.min(0)]],
      min_wingers: [this.setting.min_wingers, [Validators.required, Validators.min(0)]],
      max_wingers: [this.setting.max_wingers, [Validators.required, Validators.min(0)]],
      min_defensemen: [this.setting.min_defensemen, [Validators.required, Validators.min(0)]],
      max_defensemen: [this.setting.max_defensemen, [Validators.required, Validators.min(0)]],
      min_goalies: [this.setting.min_goalies, [Validators.required, Validators.min(0)]],
      max_goalies: [this.setting.max_goalies, [Validators.required, Validators.min(0)]],
      points_goals: [this.setting.points_goals, [Validators.required, Validators.min(0)]],
      points_assists: [this.setting.points_assists, [Validators.required, Validators.min(0)]],
      points_gwg: [this.setting.points_gwg, [Validators.required, Validators.min(0)]],
      points_shg: [this.setting.points_shg, [Validators.required, Validators.min(0)]],
      points_otg: [this.setting.points_otg, [Validators.required, Validators.min(0)]],
      points_wins: [this.setting.points_wins, [Validators.required, Validators.min(0)]],
      points_otl: [this.setting.points_otl, [Validators.required, Validators.min(0)]],
      points_shutouts: [this.setting.points_shutouts, [Validators.required, Validators.min(0)]],
      points_finals_goals: [this.setting.points_finals_goals, [Validators.required, Validators.min(0)]],
      points_finals_assists: [this.setting.points_finals_assists, [Validators.required, Validators.min(0)]],
      points_finals_gwg: [this.setting.points_finals_gwg, [Validators.required, Validators.min(0)]],
      points_finals_shg: [this.setting.points_finals_shg, [Validators.required, Validators.min(0)]],
      points_finals_otg: [this.setting.points_finals_otg, [Validators.required, Validators.min(0)]],
      points_finals_wins: [this.setting.points_finals_wins, [Validators.required, Validators.min(0)]],
      points_finals_otl: [this.setting.points_finals_otl, [Validators.required, Validators.min(0)]],
      points_finals_shutouts: [this.setting.points_finals_shutouts, [Validators.required, Validators.min(0)]]
    });
  }

  submitForm(): void {
    this.updating = true;
    this.settingsService.update(this.setting.id, this.settingForm.getRawValue()).subscribe(
      () => {
        this.updating = false;
        this.updateSuccess = true;
        setTimeout(() => {
          this.updateSuccess = false;
        }, 3000);
      },
      (error: HttpErrorResponse) => {
        this.updating = false;
        this.errors = error.error.errors;
        this.updateFailure = true;
        setTimeout(() => {
          this.updateFailure = false;
        }, 3000);
      }
    );
  }
}
