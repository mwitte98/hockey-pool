import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

import { SettingsService } from '../shared/services/settings.service';

@Component({
  templateUrl: './see-rules-dialog.component.html',
  imports: [MatButton, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
})
export class SeeRulesDialogComponent {
  numTeams = 16;

  constructor(public settingsService: SettingsService) {}
}
