import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Entry } from '../shared';

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  entries: Entry[];

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // If entries are prefetched, load them
    this.route.data.subscribe(
      (data: Entry[]) => {
        this.entries = data;
      }
    );
  }
}
