import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService, UserService } from '../services';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  constructor(
    private router: Router,
    private apiService: ApiService,
    private userService: UserService
  ) {}

  logout(): void {
    this.apiService.post('/auth/logout')
      .subscribe(data => data);
    this.userService.removeUser();
    this.router.navigateByUrl('/');
  }
}
