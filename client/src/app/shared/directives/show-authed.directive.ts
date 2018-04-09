import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { UserService } from '../services/user.service';
import { User } from '../types/interfaces';

@Directive({ selector: '[showAuthed]' })
export class ShowAuthedDirective implements OnInit {
  @Input() showAuthed: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private userService: UserService,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user: User) => {
      if (user != null && this.showAuthed || user == null && !this.showAuthed) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
