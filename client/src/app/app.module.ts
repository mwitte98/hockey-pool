import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AdminEntriesComponent } from './admin/entries/admin-entries.component';
import { AdminTeamsComponent } from './admin/teams/admin-teams.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material.module';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { DisplayErrorsComponent } from './shared/errors/display-errors.component';
import { HeaderComponent } from './shared/header/header.component';

@NgModule({
  declarations: [
    AdminEntriesComponent,
    AdminTeamsComponent,
    AppComponent,
    AuthComponent,
    DisplayErrorsComponent,
    HeaderComponent,
    HomeComponent,
    PlayerStatsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
