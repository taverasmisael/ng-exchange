import { ExchangeRate } from "./exchange-rate";

export interface ExchangeLatestRates {
  yesterday: ExchangeRate;
  today: ExchangeRate;
}
