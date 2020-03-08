import { RateFluctuation } from "./rate-fluctuation.enum";

export interface MappedComparisonRate {
  symbol: string;
  difference: number;
  percentage: number;
  fluctuation: RateFluctuation;
}
