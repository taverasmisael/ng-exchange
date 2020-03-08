import { Component, OnInit, OnDestroy } from "@angular/core";

import { Subscription } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { toISODate } from "src/app/helpers/date";
import { ExchangeAPIService } from "src/app/services/exchange/exchange-api.service";
import { ExchangeLatestRates } from "src/app/services/exchange/models/exchange-latest-rates";
import {
  calculateFluctuation,
  groupByFluctuation,
  takeLastBy,
  takeBy
} from "src/app/helpers/fluctuation";
import { RequestStatus } from "src/app/models/request-status.enum";
import { RateFluctuation } from "src/app/models/rate-fluctuation.enum";
import { toFixedNumber } from "src/app/helpers/numbers";
import { MappedComparisonRate } from "src/app/models/mapped-comparison-rate";
import { BaseCurrencyService } from "src/app/services/currency/base-currency.service";

const takeTopFive = takeLastBy("difference", 5);
const takeBottomFive = takeBy("difference", 5);

@Component({
  selector: "app-comparison-page",
  templateUrl: "./comparison-page.component.html",
  styleUrls: ["./comparison-page.component.scss"]
})
export class ComparisonPageComponent implements OnInit, OnDestroy {
  private lastRates$: Subscription;
  increaseFluctuation = RateFluctuation.UP;
  decreaseFluctuation = RateFluctuation.DOWN;
  ratesData: {
    increase: MappedComparisonRate[];
    decrease: MappedComparisonRate[];
  } = { increase: [], decrease: [] };
  errorMessage: string;
  requestStatus: RequestStatus = RequestStatus.LOADING;

  constructor(
    private exchangeService: ExchangeAPIService,
    private baseCurrency: BaseCurrencyService
  ) {}

  ngOnInit(): void {
    this.lastRates$ = this.getExchangeData().subscribe((rates: MappedRates) => {
      this.ratesData = rates;
      this.requestStatus = RequestStatus.SUCCESS;
    }, this.handleAPIError);
  }

  ngOnDestroy(): void {
    this.lastRates$.unsubscribe();
  }

  private getExchangeData = () => {
    const today = toISODate(new Date());
    return this.baseCurrency.currentCurrency.pipe(
      switchMap(base => {
        this.requestStatus = RequestStatus.LOADING;
        return this.exchangeService.getLastDays(today, base);
      }),
      map(this.mapRatesToTable)
    );
  };

  private mapRatesToTable(rates: ExchangeLatestRates): MappedRates {
    const mappedRates = Object.keys(rates.today).map(symbol => {
      const yesterday = rates.yesterday[symbol] || 0;
      const today = rates.today[symbol] || 0;

      const difference = toFixedNumber(4, today - yesterday);

      return {
        symbol,
        difference,
        percentage: toFixedNumber(4, difference / yesterday),
        fluctuation: calculateFluctuation(yesterday, today)
      };
    });

    const groupedRates = groupByFluctuation(mappedRates);

    const increase: MappedComparisonRate[] = takeTopFive(groupedRates.INCREASE);
    const decrease = takeBottomFive(
      groupedRates.DECREASE
    ) as MappedComparisonRate[];
    return { increase, decrease };
  }

  private handleAPIError = (e: any) => {
    this.errorMessage =
      "There was an error querying the latests rates. Please try later.";
    this.requestStatus = RequestStatus.ERROR;
  };
}

interface MappedRates {
  increase: MappedComparisonRate[];
  decrease: MappedComparisonRate[];
}
