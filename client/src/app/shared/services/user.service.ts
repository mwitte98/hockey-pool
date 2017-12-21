import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';
import { User } from '../models';

@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>(new User());
  currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService
  ) {}

  populate(): void {
    this.apiService.get('/auth/signed_in')
      .subscribe(
        (data: User) => this.setUser(data),
        () => this.removeUser()
      );
  }

  setUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  removeUser(): void {
    this.currentUserSubject.next(new User());
    this.isAuthenticatedSubject.next(false);
  }

  auth(type: string, credentials: any): Observable<User> {
    let route: string;
    let params: any;
    if (type === 'register') {
      route = '/user';
      params = { user: credentials };
    } else {
      route = '/auth/login';
      params = credentials;
    }
    return this.apiService.post(route, params)
      .map((data: { logged_in: boolean, user: User }) => {
        this.setUser(data.user);
        return data.user;
      });
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }
}
