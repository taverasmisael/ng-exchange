import sub from "date-fns/sub";
import formatISO from "date-fns/formatISO";

export const prevDays = (date: string, days: number) =>
  toISODate(sub(new Date(date), { days }));

export const toISODate = (date: Date) =>
  formatISO(date, { representation: "date" });
