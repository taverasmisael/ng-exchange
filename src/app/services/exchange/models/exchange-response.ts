import { ExchangeRate } from "./exchange-rate";
import { ExchangeHistoricRate } from "./exchange-historic-rate";

interface ExchangeBaseResponse {
  rates: ExchangeRate | ExchangeHistoricRate;
  base: string;
  date: string;
}

export interface ExchangeHistoricResponse extends ExchangeBaseResponse {
  rates: ExchangeHistoricRate;
}

export interface ExchangeLatestResponse extends ExchangeBaseResponse {
  rates: ExchangeRate;
}
