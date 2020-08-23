import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AdminEntriesComponent } from './admin/entries/admin-entries.component';
import { AdminSettingsComponent } from './admin/settings/admin-settings.component';
import { AdminTeamsComponent } from './admin/teams/admin-teams.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { CreateEntryComponent } from './create-entry/create-entry.component';
import { DuplicateEntryDialogComponent } from './create-entry/duplicate-entry-dialog.component';
import { EntrySubmittedDialogComponent } from './create-entry/entry-submitted-dialog.component';
import { SeeRulesDialogComponent } from './create-entry/see-rules-dialog.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material.module';
import { PlayerStatsTabComponent } from './player-stats/player-stats-tab.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { StatColumnComponent } from './player-stats/stat-column.component';
import { DisplayErrorsComponent } from './shared/errors/display-errors.component';
import { HeaderComponent } from './shared/header/header.component';

@NgModule({
  declarations: [
    AdminEntriesComponent,
    AdminSettingsComponent,
    AdminTeamsComponent,
    AppComponent,
    AuthComponent,
    CreateEntryComponent,
    DisplayErrorsComponent,
    DuplicateEntryDialogComponent,
    EntrySubmittedDialogComponent,
    HeaderComponent,
    HomeComponent,
    PlayerStatsComponent,
    PlayerStatsTabComponent,
    SeeRulesDialogComponent,
    StatColumnComponent
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
