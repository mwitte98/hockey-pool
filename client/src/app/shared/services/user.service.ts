import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>(null);
  currentUser = this.currentUserSubject.asObservable();
  authChecked = false;

  constructor(
    private apiService: ApiService
  ) {}

  checkAuth(): void {
    this.apiService.get('/auth/signed_in').subscribe((data: User) => {
      this.authChecked = true;
      this.setUser(data);
    }, () => {
      this.authChecked = true;
      this.removeUser();
    });
  }

  setUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  removeUser(): void {
    this.currentUserSubject.next(null);
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
    return this.apiService.post(route, params).pipe(
      map((user: User) => {
        this.setUser(user);
        return user;
      }));
  }

  logout(): void {
    this.apiService.delete('/auth/logout').subscribe(() => {
      this.removeUser();
    }, () => {
      this.removeUser();
    });
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }
}
