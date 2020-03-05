import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { of as observableOf, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { prevDays } from "../../helpers/date";
import { ExchangeBaseResponse } from "./models/exchange-response";
import { ExchangeHistoricRate } from "./models/exchange-historic-rate";
import { ExchangeRate } from "./models/exchange-rate";

@Injectable({
  providedIn: "root"
})
export class ExchangeAPIService {
  constructor(private http: HttpClient) {}

  private get DEFAULT_BASE() {
    return "EUR";
  }
  private get BASE_URL() {
    return "https://api.exchangeratesapi.io/";
  }

  getHistoric(start: string, end: string, base = this.DEFAULT_BASE) {
    return this.http
      .get(
        `${this.BASE_URL}history?start_at=${start}&end_at=${end}&base=${base}`
      )
      .pipe(switchMap(this.mapRates)) as Observable<ExchangeHistoricRate>;
  }

  getLatest(base = this.DEFAULT_BASE) {
    return this.http
      .get(`${this.BASE_URL}latest?base=${base}`)
      .pipe(switchMap(this.mapRates)) as Observable<ExchangeRate>;
  }

  getLastMonth(end: string, base = this.DEFAULT_BASE) {
    const start = prevDays(end, 30);

    return this.getHistoric(start, end, base);
  }

  getLastDays(end: string, base = this.DEFAULT_BASE) {
    // Last week, as we don't know when was the last change but a week seems reasonable
    const start = prevDays(end, 7);

    return this.getHistoric(start, end, base).pipe(
      switchMap(rates => {
        const [today, yesterday] = Object.keys(rates)
          .sort()
          .reverse();

        return observableOf({
          today: rates[today],
          yesterday: rates[yesterday]
        });
      })
    );
  }

  private mapRates<T extends ExchangeBaseResponse>(res: T) {
    return observableOf(res.rates);
  }
}
