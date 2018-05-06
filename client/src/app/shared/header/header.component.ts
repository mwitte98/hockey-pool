import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  currentPage: string;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPage = this.router.routerState.snapshot.url;
      }
    });
  }

  logout(): void {
    this.apiService.post('/auth/logout').subscribe();
    this.userService.removeUser();
    this.router.navigateByUrl('/');
  }
}
