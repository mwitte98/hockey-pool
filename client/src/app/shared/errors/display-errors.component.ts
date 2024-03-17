import { Component, Input } from '@angular/core';

@Component({
  selector: 'display-errors',
  templateUrl: './display-errors.component.html',
  styleUrl: './display-errors.component.scss',
})
export class DisplayErrorsComponent {
  @Input() errors: string[];

  trackBy(_index: number, error: string): string {
    return error;
  }
}
