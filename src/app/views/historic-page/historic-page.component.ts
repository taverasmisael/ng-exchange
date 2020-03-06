import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { map, switchMap, tap } from "rxjs/operators";
import { ChartDataSets, ChartOptions, ChartData } from "chart.js";
import { Label, BaseChartDirective } from "ng2-charts";
import { ExchangeAPIService } from "src/app/services/exchange/exchange-api.service";
import { toISODate, fromISODateTotoReadableDate } from "src/app/helpers/date";
import { ExchangeHistoricRate } from "src/app/services/exchange/models/exchange-historic-rate";

@Component({
  selector: "app-historic-page",
  templateUrl: "./historic-page.component.html",
  styleUrls: ["./historic-page.component.scss"]
})
export class HistoricPageComponent implements OnInit {
  currencies: Currencies = { base: "", secondary: "" };
  historicData: ChartDataSets[] = [];
  historicLabels: Label[] = [];
  chartOptions: ChartOptions = {
    responsive: true
  };

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  constructor(
    private route: ActivatedRoute,
    private exchangeAPI: ExchangeAPIService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => {
          return {
            base: params.get("base"),
            secondary: params.get("symbol")
          };
        }),
        tap(currencies => (this.currencies = currencies)),
        switchMap(this.getRatesFromAPI),
        map(this.prepareRatesForChart)
      )
      .subscribe(chartData => {
        this.historicData = chartData.datasets;
        this.historicLabels = chartData.labels;
      });
  }

  private getRatesFromAPI = (currencies: Currencies) => {
    const today = toISODate(new Date());
    return this.exchangeAPI.getLastMonth(today, currencies.base, [
      currencies.secondary
    ]);
  };

  private prepareRatesForChart(rates: ExchangeHistoricRate): RateChartData {
    const rawDatasets = Object.keys(rates)
      .sort()
      .reduce(
        (prev, key) => {
          const dataset = Object.keys(rates[key]).reduce(
            (prevDataset, symbol) => {
              const accValues = prev.dataset[symbol] || [];
              const newValues = accValues.concat(rates[key][symbol] || 0);
              return { ...prevDataset, [symbol]: newValues };
            },
            {}
          );
          const response = {
            dataset,
            labels: [...prev.labels, fromISODateTotoReadableDate(key)]
          };
          return response;
        },
        { labels: [], dataset: {} }
      );

    return {
      labels: rawDatasets.labels,
      datasets: Object.keys(rawDatasets.dataset).map(label => ({
        label,
        data: rawDatasets.dataset[label]
      }))
    };
  }
}

interface Currencies {
  base: string;
  secondary: string;
}

interface RateChartData {
  labels: Label[];
  datasets: ChartDataSets[];
}
