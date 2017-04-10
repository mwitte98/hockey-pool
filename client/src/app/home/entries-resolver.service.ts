import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { EntriesService } from '../shared';

@Injectable()
export class EntriesResolver implements Resolve<any> {
  constructor(
    private entriesService: EntriesService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.entriesService.get().map(entries => entries);
  }
}
