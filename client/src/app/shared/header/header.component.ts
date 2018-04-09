import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((data) => {
      this.currentPage = data[data.length - 1].path;
    });
  }

  logout(): void {
    this.apiService.post('/auth/logout').subscribe();
    this.userService.removeUser();
    this.router.navigateByUrl('/');
  }
}
