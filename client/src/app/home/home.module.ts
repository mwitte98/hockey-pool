import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { EntriesResolver } from './entries-resolver.service';
import { SharedModule } from '../shared';

const homeRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: HomeComponent,
    resolve: {
      entries: EntriesResolver
    }
  }
]);

@NgModule({
  imports: [
    homeRouting,
    SharedModule
  ],
  exports: [],
  declarations: [HomeComponent],
  providers: [EntriesResolver],
})
export class HomeModule {}
