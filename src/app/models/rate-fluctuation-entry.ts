import { RateFluctuation } from "./rate-fluctuation.enum";

export interface RateFluctuationEntry {
  symbol: string;
  fluctuation: RateFluctuation;
  spot: number;
}
