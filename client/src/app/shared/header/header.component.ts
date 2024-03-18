import { Component, OnInit } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { SettingsService } from '../services/settings.service';
import { UserService } from '../services/user.service';
import { User } from '../types/interfaces';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [MatAnchor, MatButton, MatMenu, MatMenuItem, MatMenuTrigger, MatToolbar, RouterLink],
})
export class HeaderComponent implements OnInit {
  currentPage: string;
  currentUser: User;

  constructor(
    private router: Router,
    public settingsService: SettingsService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPage = this.router.routerState.snapshot.url;
      }
    });

    this.userService.currentUser.subscribe((user: User) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.userService.logout();
    this.router.navigateByUrl('/').catch();
  }
}
