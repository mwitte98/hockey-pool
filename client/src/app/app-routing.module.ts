import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminTeamsComponent } from './admin/teams/admin-teams.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';

const appRoutes: Routes = [
  {
    path: 'admin/teams',
    component: AdminTeamsComponent
  },
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: 'register',
    component: AuthComponent
  },
  { path: 'player-stats', component: PlayerStatsComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
