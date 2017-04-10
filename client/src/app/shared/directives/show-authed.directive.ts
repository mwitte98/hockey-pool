import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { UserService } from '../services/user.service';

@Directive({ selector: '[showAuthed]' })
export class ShowAuthedDirective implements OnInit {
  condition: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private userService: UserService,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set showAuthed(condition: boolean) {
    this.condition = condition;
  }

  ngOnInit(): void {
    this.userService.isAuthenticated.subscribe(
      (isAuthenticated: boolean) => {
        if (isAuthenticated && this.condition || !isAuthenticated && !this.condition) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }
    );
  }
}
