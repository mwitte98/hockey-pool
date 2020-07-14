import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SettingsService } from '../../shared/services/settings.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/types/interfaces';

@Component({
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {
  updating = false;
  updateSuccess = false;
  updateFailure = false;
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
        this.createSettingForm();
      }
    });
  }

  createSettingForm(): void {
    const setting = this.settingsService.setting;
    this.settingForm = this.fb.group({
      is_playoffs_started: [setting.is_playoffs_started, Validators.required],
      min_centers: [setting.min_centers, [Validators.required, Validators.min(0)]],
      max_centers: [setting.max_centers, [Validators.required, Validators.min(0)]],
      min_wingers: [setting.min_wingers, [Validators.required, Validators.min(0)]],
      max_wingers: [setting.max_wingers, [Validators.required, Validators.min(0)]],
      min_defensemen: [setting.min_defensemen, [Validators.required, Validators.min(0)]],
      max_defensemen: [setting.max_defensemen, [Validators.required, Validators.min(0)]],
      min_goalies: [setting.min_goalies, [Validators.required, Validators.min(0)]],
      max_goalies: [setting.max_goalies, [Validators.required, Validators.min(0)]],
      points_goals: [setting.points_goals, [Validators.required, Validators.min(0)]],
      points_assists: [setting.points_assists, [Validators.required, Validators.min(0)]],
      points_gwg: [setting.points_gwg, [Validators.required, Validators.min(0)]],
      points_shg: [setting.points_shg, [Validators.required, Validators.min(0)]],
      points_otg: [setting.points_otg, [Validators.required, Validators.min(0)]],
      points_wins: [setting.points_wins, [Validators.required, Validators.min(0)]],
      points_otl: [setting.points_otl, [Validators.required, Validators.min(0)]],
      points_shutouts: [setting.points_shutouts, [Validators.required, Validators.min(0)]],
      points_finals_goals: [setting.points_finals_goals, [Validators.required, Validators.min(0)]],
      points_finals_assists: [setting.points_finals_assists, [Validators.required, Validators.min(0)]],
      points_finals_gwg: [setting.points_finals_gwg, [Validators.required, Validators.min(0)]],
      points_finals_shg: [setting.points_finals_shg, [Validators.required, Validators.min(0)]],
      points_finals_otg: [setting.points_finals_otg, [Validators.required, Validators.min(0)]],
      points_finals_wins: [setting.points_finals_wins, [Validators.required, Validators.min(0)]],
      points_finals_otl: [setting.points_finals_otl, [Validators.required, Validators.min(0)]],
      points_finals_shutouts: [setting.points_finals_shutouts, [Validators.required, Validators.min(0)]]
    });
  }

  submitForm(): void {
    this.updating = true;
    this.settingsService.update(this.settingForm.getRawValue()).subscribe(
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
