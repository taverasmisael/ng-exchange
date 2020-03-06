import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

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

  getHistoric(
    start: string,
    end: string,
    base = this.DEFAULT_BASE,
    secondary: string[] = []
  ) {
    let params = new HttpParams({
      fromObject: {
        start_at: start,
        end_at: end,
        base
      }
    });

    if (secondary.length) {
      params = params.append("symbols", secondary.join());
    }

    return this.http
      .get(`${this.BASE_URL}history`, { params })
      .pipe(switchMap(this.mapRates)) as Observable<ExchangeHistoricRate>;
  }

  getLatest(base = this.DEFAULT_BASE) {
    const params = new HttpParams({ fromObject: { base } });
    return this.http
      .get(`${this.BASE_URL}latest`, { params })
      .pipe(switchMap(this.mapRates)) as Observable<ExchangeRate>;
  }

  getLastMonth(
    end: string,
    base = this.DEFAULT_BASE,
    secondary: string[] = []
  ) {
    const start = prevDays(end, 30);

    return this.getHistoric(start, end, base, secondary);
  }

  getLastDays(end: string, base = this.DEFAULT_BASE, secondary: string[] = []) {
    // Last week, as we don't know when was the last change but a week seems reasonable
    const start = prevDays(end, 7);

    return this.getHistoric(start, end, base, secondary).pipe(
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
