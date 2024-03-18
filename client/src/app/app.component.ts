import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './shared/header/header.component';
import { SettingsService } from './shared/services/settings.service';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
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
