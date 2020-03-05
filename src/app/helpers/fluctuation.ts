import { RateFluctuation } from "../models/rate-fluctuation.enum";

type FluctuationCalculator = (prev: number, next: number) => RateFluctuation;
export const calculateFluctuation: FluctuationCalculator = (prev, next) => {
  if (prev > next) {
    return RateFluctuation.UP;
  } else if (next > prev) {
    return RateFluctuation.DOWN;
  }

  return RateFluctuation.SAME;
};
