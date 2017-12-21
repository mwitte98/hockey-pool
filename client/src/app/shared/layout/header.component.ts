import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

import { ApiService, UserService } from '../services';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('navCollapseState', [
      state('1', style({ height: '0px' })),
      state('0', style({ height: '*' })),
      transition('1 <=> 0', animate('350ms'))
    ])
  ]
})

export class HeaderComponent implements OnInit {
  isCollapsed: boolean;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isCollapsed = true;
  }

  logout(): void {
    this.apiService.post('/auth/logout')
      .subscribe((data: { logged_in: boolean }) => data);
    this.userService.removeUser();
    this.isCollapsed = true;
    this.router.navigateByUrl('/');
  }
}
