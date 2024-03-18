import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SettingsService } from '../../shared/services/settings.service';
import { UserService } from '../../shared/services/user.service';
import { SettingForm } from '../../shared/types/forms';
import { User } from '../../shared/types/interfaces';

@Component({
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss',
})
export class AdminSettingsComponent implements OnInit {
  updating = false;
  updateSuccess = false;
  updateFailure = false;
  errors: string[] = [];
  settingForm: FormGroup<SettingForm>;

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private userService: UserService,
    private fb: FormBuilder,
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
    const { setting } = this.settingsService;
    this.settingForm = this.fb.nonNullable.group({
      isPlayoffsStarted: [setting.isPlayoffsStarted, Validators.required],
      minCenters: [setting.minCenters, [Validators.required, Validators.min(0)]],
      maxCenters: [setting.maxCenters, [Validators.required, Validators.min(0)]],
      minWingers: [setting.minWingers, [Validators.required, Validators.min(0)]],
      maxWingers: [setting.maxWingers, [Validators.required, Validators.min(0)]],
      minDefensemen: [setting.minDefensemen, [Validators.required, Validators.min(0)]],
      maxDefensemen: [setting.maxDefensemen, [Validators.required, Validators.min(0)]],
      minGoalies: [setting.minGoalies, [Validators.required, Validators.min(0)]],
      maxGoalies: [setting.maxGoalies, [Validators.required, Validators.min(0)]],
      pointsGoals: [setting.pointsGoals, [Validators.required, Validators.min(0)]],
      pointsAssists: [setting.pointsAssists, [Validators.required, Validators.min(0)]],
      pointsGwg: [setting.pointsGwg, [Validators.required, Validators.min(0)]],
      pointsShg: [setting.pointsShg, [Validators.required, Validators.min(0)]],
      pointsOtg: [setting.pointsOtg, [Validators.required, Validators.min(0)]],
      pointsWins: [setting.pointsWins, [Validators.required, Validators.min(0)]],
      pointsOtl: [setting.pointsOtl, [Validators.required, Validators.min(0)]],
      pointsShutouts: [setting.pointsShutouts, [Validators.required, Validators.min(0)]],
      roundMultipliers: this.fb.array(
        setting.roundMultipliers.map((roundMultiplier: number) => {
          return this.fb.control(roundMultiplier, [Validators.required, Validators.min(0)]);
        }),
      ),
    });
  }

  submitForm(): void {
    this.updating = true;
    this.settingsService.update(this.settingForm.getRawValue()).subscribe({
      next: () => {
        this.updating = false;
        this.updateSuccess = true;
        setTimeout(() => {
          this.updateSuccess = false;
        }, 3000);
      },
      error: (error: HttpErrorResponse) => {
        this.updating = false;
        this.errors = error.error.errors;
        this.updateFailure = true;
        setTimeout(() => {
          this.updateFailure = false;
        }, 3000);
      },
    });
  }
}
