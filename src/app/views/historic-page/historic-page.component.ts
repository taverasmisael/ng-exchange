import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { map } from "rxjs/operators";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Label, BaseChartDirective } from "ng2-charts";

@Component({
  selector: "app-historic-page",
  templateUrl: "./historic-page.component.html",
  styleUrls: ["./historic-page.component.scss"]
})
export class HistoricPageComponent implements OnInit {
  currencies: { base: string; secondary: string } = { base: "", secondary: "" };
  historicData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: "Series A" },
    { data: [28, 48, 40, 19, 86, 27, 90], label: "Series B" }
  ];
  historicLabels: Label[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July"
  ];
  chartOptions: ChartOptions = {
    responsive: true
  };

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => {
          return {
            base: params.get("base"),
            secondary: params.get("symbol")
          };
        })
      )
      .subscribe(currencies => {
        this.currencies = currencies;
      });
  }
}
