import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class BaseCurrencyService {
  readonly currentCurrency = new BehaviorSubject("EUR");
  current: string;
  constructor() {
    this.currentCurrency.subscribe(currency => (this.current = currency));
  }

  setCurrent(currency: string) {
    this.currentCurrency.next(currency);
  }
}
