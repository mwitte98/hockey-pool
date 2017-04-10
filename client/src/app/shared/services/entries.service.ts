import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';
import { Entry } from '../models';

@Injectable()
export class EntriesService {
  constructor(
    private apiService: ApiService
  ) {}

  get(): Observable<Entry[]> {
    return this.apiService.get('/entries')
      .map((data: Entry[]) => data);
  }
}
