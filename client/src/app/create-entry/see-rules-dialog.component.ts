import { Component } from '@angular/core';

import { SettingsService } from '../shared/services/settings.service';

@Component({
  templateUrl: './see-rules-dialog.component.html',
})
export class SeeRulesDialogComponent {
  numTeams = 16;

  constructor(public settingsService: SettingsService) {}
}
