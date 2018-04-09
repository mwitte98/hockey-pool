import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCardModule, MatInputModule, MatMenuModule, MatProgressSpinnerModule,
  MatSlideToggleModule, MatTableModule, MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { ShowAuthedDirective } from './shared/directives/show-authed.directive';
import { DisplayErrorsComponent } from './shared/errors/display-errors.component';
import { HeaderComponent } from './shared/header/header.component';
import { ApiService } from './shared/services/api.service';
import { AuthGuard } from './shared/services/auth-guard.service';
import { EntriesService } from './shared/services/entries.service';
import { NoAuthGuard } from './shared/services/no-auth-guard.service';
import { UserService } from './shared/services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DisplayErrorsComponent,
    HeaderComponent,
    HomeComponent,
    ShowAuthedDirective
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTableModule,
    MatToolbarModule,
    AppRoutingModule
  ],
  providers: [
    ApiService,
    AuthGuard,
    EntriesService,
    NoAuthGuard,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
