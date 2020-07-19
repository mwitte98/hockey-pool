import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Setting } from '../types/interfaces';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  setting: Setting;

  constructor(private apiService: ApiService) {}

  get(): Observable<Setting> {
    return this.apiService.get('/settings').pipe(
      map((setting: Setting) => {
        this.setting = setting;
        return setting;
      })
    );
  }

  update(updatedSetting: Setting): Observable<Setting> {
    const settingId = this.setting.id;
    return this.apiService.put(`/settings/${settingId}`, updatedSetting).pipe(
      map(() => {
        this.setting = updatedSetting;
        this.setting.id = settingId;
        return updatedSetting;
      })
    );
  }
}
