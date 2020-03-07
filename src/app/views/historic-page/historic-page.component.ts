import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { map, switchMap, tap } from "rxjs/operators";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Label } from "ng2-charts";
import { ExchangeAPIService } from "src/app/services/exchange/exchange-api.service";
import { toISODate, fromISODateTotoReadableDate } from "src/app/helpers/date";
import { ExchangeHistoricRate } from "src/app/services/exchange/models/exchange-historic-rate";
import { RequestStatus } from "src/app/models/request-status.enum";
import { BaseCurrencyService } from "src/app/services/currency/base-currency.service";
import toUpperCase from "ramda/es/toUpper";

@Component({
  selector: "app-historic-page",
  templateUrl: "./historic-page.component.html",
  styleUrls: ["./historic-page.component.scss"]
})
export class HistoricPageComponent implements OnInit {
  historicData: ChartDataSets[] = [];
  historicLabels: Label[] = [];
  chartOptions: ChartOptions = { responsive: true };
  today = toISODate(new Date());
  currencies: Currencies = { base: "", secondary: "" };
  requestStatus: RequestStatus = RequestStatus.LOADING;
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private exchangeAPI: ExchangeAPIService,
    private baseCurrency: BaseCurrencyService
  ) {}

  ngOnInit(): void {
    this.getCurrencies()
      .pipe(
        tap(currencies => (this.currencies = currencies)),
        switchMap(this.getRatesFromAPI),
        map(this.prepareRatesForChart)
      )
      .subscribe(chartData => {
        this.requestStatus = RequestStatus.SUCCESS;
        this.historicData = chartData.datasets;
        this.historicLabels = chartData.labels;
      }, this.handleAPIError);
  }

  private getCurrencies = () =>
    this.baseCurrency.currentCurrency.pipe(switchMap(this.mapRouteParams));

  private mapRouteParams = (base: string) => {
    return this.route.paramMap.pipe(
      map(params => ({
        base,
        secondary: toUpperCase(params.get("secondary") || "")
      }))
    );
  };

  private getRatesFromAPI = (currencies: Currencies) =>
    this.exchangeAPI.getLastMonth(this.today, currencies.base, [
      currencies.secondary
    ]);
  private prepareRatesForChart(rates: ExchangeHistoricRate): RateChartData {
    const rawDatasets = Object.keys(rates)
      .sort()
      .reduce(
        (prev, key) => {
          const dataset = Object.keys(rates[key]).reduce(
            (prevDataset, secondary) => {
              const accValues = prev.dataset[secondary] || [];
              const newValues = accValues.concat(rates[key][secondary] || 0);
              return { ...prevDataset, [secondary]: newValues };
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

  private handleAPIError = (e: any) => {
    console.error(e);
    this.errorMessage =
      "There was an error querying the historic rates. Please try later.";
    this.requestStatus = RequestStatus.ERROR;
  };
}

interface Currencies {
  base: string;
  secondary: string;
}

interface RateChartData {
  labels: Label[];
  datasets: ChartDataSets[];
}
