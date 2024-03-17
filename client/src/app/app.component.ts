import { Component, OnInit } from '@angular/core';

import { SettingsService } from './shared/services/settings.service';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.settingsService.get().subscribe(() => {
      this.userService.checkAuth();
    });
  }
}
