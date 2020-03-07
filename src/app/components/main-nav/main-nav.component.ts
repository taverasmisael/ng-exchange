import { Component } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { BaseCurrencyService } from "src/app/services/currency/base-currency.service";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"]
})
export class MainNavComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  currentCurrency$ = this.baseCurrency.currentCurrency;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private baseCurrency: BaseCurrencyService
  ) {}

  setBaseCurrency(currency: string) {
    this.baseCurrency.setCurrent(currency);
  }
}
