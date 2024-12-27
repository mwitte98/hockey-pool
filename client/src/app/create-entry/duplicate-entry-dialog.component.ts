import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  templateUrl: './duplicate-entry-dialog.component.html',
  imports: [MatButton, MatDialogActions, MatDialogClose, MatDialogContent],
})
export class DuplicateEntryDialogComponent {}
