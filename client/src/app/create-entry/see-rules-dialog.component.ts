import { Component } from '@angular/core';

import { SettingsService } from '../shared/services/settings.service';

@Component({
  templateUrl: './see-rules-dialog.component.html'
})
export class SeeRulesDialogComponent {
  constructor(public settingsService: SettingsService) {}
}
