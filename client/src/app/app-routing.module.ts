import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminEntriesComponent } from './admin/entries/admin-entries.component';
import { AdminSettingsComponent } from './admin/settings/admin-settings.component';
import { AdminTeamsComponent } from './admin/teams/admin-teams.component';
import { AuthComponent } from './auth/auth.component';
import { CreateEntryComponent } from './create-entry/create-entry.component';
import { HomeComponent } from './home/home.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';

const titlePrefix = 'NHL Playoff Pool - ';

const appRoutes: Routes = [
  { path: 'admin/entries', component: AdminEntriesComponent, title: `${titlePrefix}Admin - Entries` },
  { path: 'admin/teams', component: AdminTeamsComponent, title: `${titlePrefix}Admin - Teams` },
  { path: 'admin/settings', component: AdminSettingsComponent, title: `${titlePrefix}Admin - Settings` },
  { path: 'entry/new', component: CreateEntryComponent, title: `${titlePrefix}Admin - Create Entry` },
  { path: 'login', component: AuthComponent, title: `${titlePrefix}Login` },
  { path: 'register', component: AuthComponent, title: `${titlePrefix}Register` },
  { path: 'player-stats', component: PlayerStatsComponent, title: `${titlePrefix}Player Stats` },
  { path: '', component: HomeComponent, title: `${titlePrefix}Home` },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
