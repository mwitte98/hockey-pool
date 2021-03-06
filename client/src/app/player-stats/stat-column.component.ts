import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatCellDef, MatColumnDef, MatHeaderCellDef, MatTable } from '@angular/material/table';

import { PlayerStatColumn } from '../shared/types/interfaces';

@Component({
  selector: 'stat-column',
  templateUrl: './stat-column.component.html'
})
export class StatColumnComponent implements OnInit {
  @Input() data: PlayerStatColumn;
  @Input() teamsRemaining: number;

  @ViewChild(MatColumnDef, { static: true }) columnDef: MatColumnDef;
  @ViewChild(MatCellDef, { static: true }) cell: MatCellDef;
  @ViewChild(MatHeaderCellDef, { static: true }) headerCell: MatHeaderCellDef;

  constructor(public table: MatTable<any>) {}

  ngOnInit(): void {
    if (this.table) {
      this.columnDef.name = this.data.stat;
      this.columnDef.cell = this.cell;
      this.columnDef.headerCell = this.headerCell;
      this.table.addColumnDef(this.columnDef);
    }
  }
}
