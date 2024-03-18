import { Component, Input } from '@angular/core';

@Component({
  selector: 'display-errors',
  templateUrl: './display-errors.component.html',
  styleUrl: './display-errors.component.scss',
  standalone: true,
})
export class DisplayErrorsComponent {
  @Input() errors: string[];
}
