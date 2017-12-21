import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

import { EntriesService, Entry } from '../shared';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('bodyExpansion', [
      state('0', style({height: '0px'})),
      state('1', style({height: '*'})),
      transition('0 <=> 1', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
    ])
  ]
})
export class HomeComponent implements OnInit {
  entries: Entry[];
  loading: boolean;
  isPanelOpen: boolean[];
  showingAllEntries: boolean;
  showingEliminatedTeams: boolean;

  constructor(
    private entriesService: EntriesService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.showingAllEntries = false;
    this.showingEliminatedTeams = false;

    this.entriesService.get().subscribe(
      (data: Entry[]) => {
        this.loading = false;
        this.isPanelOpen = [];
        this.entries = [];
        data.forEach((entry: Entry) => {
          this.isPanelOpen.push(false);
          this.entries.push(new Entry(entry.id, entry.name, entry.players));
        });
        this.sortEntries();
      }
    );
  }

  toggleAllPanels(): void {
    this.isPanelOpen.forEach((_isOpen: boolean, index: number) => {
      this.isPanelOpen[index] = !this.showingAllEntries;
    });
  }

  private sortEntries(): void {
    this.entries.sort((a: Entry, b: Entry) => a.compare(b) );

    this.entries.forEach((entry: Entry, index: number) => {
      if (index === 0) {
        entry.rank = 1;
        return;
      }
      if (!entry.tiebreaker || entry.tiebreaker !== 'Tied') {
        entry.rank = index + 1;
        return;
      }

      const prevEntry: Entry = this.entries[index - 1];
      if (entry.equals(prevEntry)) {
            entry.rank = prevEntry.rank;
      } else {
        entry.rank = index + 1;
      }
    });
  }
}
