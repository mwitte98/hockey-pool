import { Component, Input } from '@angular/core';

import { Errors } from '../models';

@Component({
  selector: 'display-errors',
  templateUrl: './display-errors.component.html',
  styleUrls: ['./display-errors.component.css']
})

export class DisplayErrorsComponent {
  formattedErrors: Array<string> = [];

  @Input()
  set errors(errorList: Errors) {
    this.formattedErrors = errorList.errors;
  }

  get errorList(): Array<string> {
    return this.formattedErrors;
  }
}
