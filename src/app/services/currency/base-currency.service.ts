import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class BaseCurrencyService {
  readonly currentCurrency = new BehaviorSubject("EUR");
  private readonly LSKEY = "XO-BASECURRENCY";
  current: string;
  constructor() {
    if (localStorage.getItem(this.LSKEY)) {
      this.setCurrent(localStorage.getItem(this.LSKEY));
    }
    this.currentCurrency.subscribe(currency => (this.current = currency));
  }

  setCurrent(currency: string) {
    if (currency !== this.current) {
      localStorage.setItem(this.LSKEY, currency);
      this.currentCurrency.next(currency);
    }
  }
}
