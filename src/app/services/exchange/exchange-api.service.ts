import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { map } from "rxjs/operators";

import { prevDays } from "../../helpers/date";
import {
  ExchangeLatestResponse,
  ExchangeHistoricResponse
} from "./models/exchange-response";

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

  private getHistoric(start: string, end: string, base = this.DEFAULT_BASE) {
    return this.http
      .get(
        `${this.BASE_URL}history?start_at=${start}&end_at=${end}&base=${base}`
      )
      .pipe(map((res: ExchangeHistoricResponse) => res.rates));
  }

  getLatest(base = this.DEFAULT_BASE) {
    return this.http
      .get(`${this.BASE_URL}latest?base=${base}`)
      .pipe(map((res: ExchangeLatestResponse) => res.rates));
  }

  getLastMonth(end: string, base = this.DEFAULT_BASE) {
    const start = prevDays(end, 30);

    return this.getHistoric(start, end, base);
  }

  getLastDays(end: string, base = this.DEFAULT_BASE) {
    // Last week, as we don't know when was the last change but a week seems reasonable
    const start = prevDays(end, 7);

    return this.getHistoric(start, end, base).pipe(
      map(rates => {
        const [today, yesterday] = Object.keys(rates)
          .sort()
          .reverse();

        return { today: rates[today], yesterday: rates[yesterday] };
      })
    );
  }
}
