import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService
  ) {}

  canActivate(): Observable<boolean> {
    return this.userService.isAuthenticated.take(1);
  }
}
