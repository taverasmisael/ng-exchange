import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";

import { Subscription } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { toISODate } from "src/app/helpers/date";
import { ExchangeAPIService } from "src/app/services/exchange/exchange-api.service";
import { ExchangeLatestRates } from "src/app/services/exchange/models/exchange-latest-rates";
import { RateFluctuationEntry } from "src/app/models/rate-fluctuation-entry";
import { calculateFluctuation } from "src/app/helpers/fluctuation";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { RequestStatus } from "src/app/models/request-status.enum";
import { RateFluctuation } from "src/app/models/rate-fluctuation.enum";
import { BaseCurrencyService } from "src/app/services/currency/base-currency.service";

@Component({
  selector: "app-latest-page",
  templateUrl: "./latest-page.component.html",
  styleUrls: ["./latest-page.component.scss"]
})
export class LatestPageComponent implements OnInit, OnDestroy {
  private lastRates$: Subscription;
  rates: MatTableDataSource<RateFluctuationEntry>;
  errorMessage: string;
  requestStatus: RequestStatus = RequestStatus.LOADING;
  currentCurrency$ = this.baseCurrency.currentCurrency;
  displayedColumns = ["fluctuation", "symbol", "spot", "chart"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private exchangeService: ExchangeAPIService,
    private baseCurrency: BaseCurrencyService
  ) {}

  ngOnInit(): void {
    this.lastRates$ = this.baseCurrency.currentCurrency
      .pipe(switchMap(base => this.getExchangeData(base)))
      .subscribe(this.updateDataSource, this.handleAPIError);
  }

  ngOnDestroy(): void {
    this.lastRates$.unsubscribe();
  }

  private getExchangeData = (base: string) => {
    const today = toISODate(new Date());
    this.requestStatus = RequestStatus.LOADING;
    return this.exchangeService
      .getLastDays(today, base)
      .pipe(map(this.mapRatesToTable));
  };

  private updateDataSource = (rates: MappedRates[]) => {
    this.requestStatus = RequestStatus.SUCCESS;
    this.rates = new MatTableDataSource(rates);
    this.rates.paginator = this.paginator;
    this.rates.sort = this.sort;
  };

  private mapRatesToTable(rates: ExchangeLatestRates): MappedRates[] {
    return Object.keys(rates.today).map(symbol => ({
      symbol,
      spot: rates.today[symbol],
      fluctuation: calculateFluctuation(
        rates.yesterday[symbol] || 0, // Yesterday may not have today's symbol
        rates.today[symbol]
      )
    }));
  }

  private handleAPIError = () => {
    this.errorMessage =
      "There was an error querying the latests rates. Please try later.";
    this.requestStatus = RequestStatus.ERROR;
  };
}

interface MappedRates {
  symbol: string;
  spot: number;
  fluctuation: RateFluctuation;
}
