import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';

import { AdminEntriesComponent } from './app/admin/entries/admin-entries.component';
import { AdminSettingsComponent } from './app/admin/settings/admin-settings.component';
import { AdminTeamsComponent } from './app/admin/teams/admin-teams.component';
import { AppComponent } from './app/app.component';
import { AuthComponent } from './app/auth/auth.component';
import { CreateEntryComponent } from './app/create-entry/create-entry.component';
import { HistoricalGraphComponent } from './app/home/historical-graph.component';
import { HomeComponent } from './app/home/home.component';
import { PlayerStatsComponent } from './app/player-stats/player-stats.component';
import { Interceptor } from './app/shared/interceptors/interceptor';
import { environment } from './environments/environment';

const titlePrefix = 'NHL Playoff Pool - ';
const appRoutes: Routes = [
  { path: 'admin/entries', component: AdminEntriesComponent, title: `${titlePrefix}Admin - Entries` },
  { path: 'admin/teams', component: AdminTeamsComponent, title: `${titlePrefix}Admin - Teams` },
  { path: 'admin/settings', component: AdminSettingsComponent, title: `${titlePrefix}Admin - Settings` },
  { path: 'entry/new', component: CreateEntryComponent, title: `${titlePrefix}Admin - Create Entry` },
  { path: 'login', component: AuthComponent, title: `${titlePrefix}Login` },
  { path: 'register', component: AuthComponent, title: `${titlePrefix}Register` },
  { path: 'player-stats', component: PlayerStatsComponent, title: `${titlePrefix}Player Stats` },
  { path: 'rank-by-day', component: HistoricalGraphComponent, title: `${titlePrefix}Rank by Day` },
  { path: '', component: HomeComponent, title: `${titlePrefix}Home` },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch();
