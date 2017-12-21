import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import {
  ApiService,
  AuthGuard,
  EntriesService,
  HeaderComponent,
  SharedModule,
  UserService
} from './shared';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([]);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpModule,
    AuthModule,
    HomeModule,
    rootRouting,
    SharedModule
  ],
  providers: [
    ApiService,
    AuthGuard,
    EntriesService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
