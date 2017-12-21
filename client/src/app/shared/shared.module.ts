import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';

import { DisplayErrorsComponent } from './errors/display-errors.component';
import { ShowAuthedDirective } from './directives/show-authed.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    DisplayErrorsComponent,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ShowAuthedDirective
  ],
  declarations: [
    DisplayErrorsComponent,
    ShowAuthedDirective
  ],
  providers: [],
})
export class SharedModule {}
