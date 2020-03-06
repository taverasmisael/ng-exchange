import sub from "date-fns/sub";
import formatISO from "date-fns/formatISO";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";

export const prevDays = (date: string, days: number) =>
  toISODate(sub(new Date(date), { days }));

export const toISODate = (date: Date) =>
  formatISO(date, { representation: "date" });

export const fromISODate = (date: string) => parseISO(date);

export const toReadableDate = (date: Date) => format(date, "d/M");

export const fromISODateTotoReadableDate = (date: string) =>
  toReadableDate(fromISODate(date));
