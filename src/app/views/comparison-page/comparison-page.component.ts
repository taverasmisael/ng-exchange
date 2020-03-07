import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";

import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { take, takeLast } from "ramda";

import { toISODate } from "src/app/helpers/date";
import { ExchangeAPIService } from "src/app/services/exchange/exchange-api.service";
import { ExchangeLatestRates } from "src/app/services/exchange/models/exchange-latest-rates";
import { RateFluctuationEntry } from "src/app/models/rate-fluctuation-entry";
import { calculateFluctuation } from "src/app/helpers/fluctuation";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { RequestStatus } from "src/app/models/request-status.enum";
import { RateFluctuation } from "src/app/models/rate-fluctuation.enum";
import { toFixedNumber } from "src/app/helpers/numbers";

@Component({
  selector: "app-comparison-page",
  templateUrl: "./comparison-page.component.html",
  styleUrls: ["./comparison-page.component.scss"]
})
export class ComparisonPageComponent implements OnInit {
  private lastRates$: Subscription;
  private rates: MappedRates;
  currentRates: MatTableDataSource<MappedRate>;
  errorMessage: string;
  requestStatus: RequestStatus = RequestStatus.LOADING;
  displayedColumns = ["fluctuation", "symbol", "percentage", "difference"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private exchangeService: ExchangeAPIService) {}

  ngOnInit(): void {
    const today = toISODate(new Date());
    this.lastRates$ = this.exchangeService
      .getLastDays(today)
      .pipe(map(this.mapRatesToTable))
      .subscribe((rates: MappedRates) => {
        this.requestStatus = RequestStatus.SUCCESS;
        this.rates = rates;
        this.currentRates = new MatTableDataSource(rates.increase);
        this.currentRates.paginator = this.paginator;
        this.currentRates.sort = this.sort;
      }, this.handleAPIError);
  }

  ngOnDestroy(): void {
    this.lastRates$.unsubscribe();
  }

  private mapRatesToTable(rates: ExchangeLatestRates): MappedRates {
    const mappedRates = Object.keys(rates.today)
      .map(symbol => {
        const yesterday = rates.yesterday[symbol] || 0;
        const today = rates.today[symbol] || 0;

        const difference = toFixedNumber(4, today - yesterday);

        return {
          symbol,
          difference,
          percentage: toFixedNumber(4, difference / yesterday),
          fluctuation: calculateFluctuation(yesterday, today)
        };
      })
      // Sort by fluctuation with the twist that rates with fluctiation=== SAME are considered as negative
      .sort((_, b) =>
        b.fluctuation === RateFluctuation.SAME ? -1 : b.fluctuation
      );

    const increase = take(5, mappedRates);
    const decrease = takeLast(5, mappedRates);
    console.warn(increase);
    return { increase, decrease };
  }

  private handleAPIError = () => {
    this.errorMessage =
      "There was an error querying the latests rates. Please try later.";
    this.requestStatus = RequestStatus.ERROR;
  };
}

interface MappedRates {
  increase: MappedRate[];
  decrease: MappedRate[];
}

interface MappedRate {
  symbol: string;
  difference: number;
  percentage: number;
  fluctuation: RateFluctuation;
}
