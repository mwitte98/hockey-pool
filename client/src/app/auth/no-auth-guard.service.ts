import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { UserService } from '../shared';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    private userService: UserService
  ) {}

  canActivate(): Observable<boolean> {
    // If isAuthenticated is false, canActivate is true
    return this.userService.isAuthenticated.take(1).map((bool: boolean) => !bool);
  }
}
