import groupBy from "ramda/es/groupBy";
import sortBy from "ramda/es/sortBy";
import prop from "ramda/es/prop";
import compose from "ramda/es/compose";
import take from "ramda/es/take";
import takeLast from "ramda/es/takeLast";

import { RateFluctuation } from "../models/rate-fluctuation.enum";

type FluctuationCalculator = (prev: number, next: number) => RateFluctuation;
export const calculateFluctuation: FluctuationCalculator = (prev, next) => {
  if (prev < next) {
    return RateFluctuation.UP;
  } else if (prev > next) {
    return RateFluctuation.DOWN;
  }

  return RateFluctuation.SAME;
};

export const groupByFluctuation = groupBy((element: HasFluctuation) => {
  switch (element.fluctuation) {
    case RateFluctuation.UP:
      return "INCREASE";
    case RateFluctuation.SAME:
      return "SAME";
    case RateFluctuation.DOWN:
      return "DECREASE";
  }
});

export const sortByDifference = sortBy(prop("difference"));

export const takeBy = (p: string, n: number) =>
  compose(take(n), sortBy(prop(p)));

export const takeLastBy = (p: string, n: number) =>
  // @ts-ignore
  compose(takeLast(n), sortBy(prop(p)));

interface HasFluctuation {
  fluctuation: RateFluctuation;
}
