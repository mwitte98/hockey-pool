import { NgModule } from '@angular/core';
import {
  MdButtonModule,
  MdCardModule,
  MdInputModule,
  MdProgressSpinnerModule,
  MdSlideToggleModule,
  MdToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    MdProgressSpinnerModule,
    MdSlideToggleModule,
    MdToolbarModule
  ],
  exports: [
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    MdProgressSpinnerModule,
    MdSlideToggleModule,
    MdToolbarModule
  ],
  declarations: [],
  providers: [],
})
export class MaterialModule {}
