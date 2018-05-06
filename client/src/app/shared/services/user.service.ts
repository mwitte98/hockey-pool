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

  constructor(
    private apiService: ApiService
  ) {}

  populate(): void {
    this.apiService.get('/auth/signed_in').subscribe((data: User) => {
      this.setUser(data);
    }, () => {
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
      map((data: { logged_in: boolean, user: User }) => {
        this.setUser(data.user);
        return data.user;
      }));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }
}
