import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnChanges,
  SimpleChange,
  SimpleChanges
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

import equals from "ramda/es/equals";

import { MappedComparisonRate } from "src/app/models/mapped-comparison-rate";

@Component({
  selector: "app-comparison-table",
  templateUrl: "./comparison-table.component.html"
})
export class ComparisonTableComponent implements OnInit, OnChanges {
  @Input() data: MappedComparisonRate[];
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<MappedComparisonRate>;
  displayedColumns = ["symbol", "percentage", "difference"];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: ComparisonTableChanges) {
    const { data } = changes;
    if (!equals(data.currentValue, data.previousValue)) {
      this.initializeTable(changes.data.currentValue);
    }
  }

  private initializeTable(data: MappedComparisonRate[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }
}

interface ComparisonTableChanges extends SimpleChanges {
  data: ComprisonTableDataChange;
}

interface ComprisonTableDataChange extends SimpleChange {
  previousValue: MappedComparisonRate[];
  currentValue: MappedComparisonRate[];
}
