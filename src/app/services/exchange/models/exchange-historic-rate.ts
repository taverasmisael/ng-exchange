import { ExchangeRate } from "./exchange-rate";

export interface ExchangeHistoricRate {
  [date: string]: ExchangeRate;
}
