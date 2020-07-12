import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Setting } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private apiService: ApiService) {}

  get(): Observable<Setting> {
    return this.apiService.get('/settings');
  }

  update(id: number, setting: Setting): Observable<any> {
    return this.apiService.put(`/settings/${id}`, setting);
  }
}
