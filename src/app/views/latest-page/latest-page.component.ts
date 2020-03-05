import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";

import { Subscription } from "rxjs";

import { toISODate } from "src/app/helpers/date";
import { ExchangeAPIService } from "src/app/services/exchange/exchange-api.service";
import { ExchangeLatestRates } from "src/app/services/exchange/models/exchange-latest-rates";
import { map } from "rxjs/operators";
import { RateFluctuationEntry } from "src/app/models/rate-fluctuation-entry";
import { calculateFluctuation } from "src/app/helpers/fluctuation";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-latest-page",
  templateUrl: "./latest-page.component.html",
  styleUrls: ["./latest-page.component.scss"]
})
export class LatestPageComponent implements OnInit, OnDestroy {
  private lastRates$: Subscription;
  rates: MatTableDataSource<RateFluctuationEntry>;
  displayedColumns = ["fluctuation", "symbol", "spot", "chart"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private exchangeService: ExchangeAPIService) {}

  ngOnInit(): void {
    const today = toISODate(new Date());
    this.lastRates$ = this.exchangeService
      .getLastDays(today)
      .pipe(map(this.mapRatesToTable))
      .subscribe(rates => {
        this.rates = new MatTableDataSource(rates);
        this.rates.paginator = this.paginator;
        this.rates.sort = this.sort;
      });
  }

  ngOnDestroy(): void {
    this.lastRates$.unsubscribe();
  }

  private mapRatesToTable(rates: ExchangeLatestRates) {
    const symbols = Object.keys(rates.today);
    return symbols.map(symbol => ({
      symbol,
      spot: rates.today[symbol],
      fluctuation: calculateFluctuation(
        rates.yesterday[symbol],
        rates.today[symbol]
      )
    }));
  }
}
