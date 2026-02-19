// Date helper utilities for date math and formatting

export const MILLI_SECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return startOfDay(d);
}

export function startOfWeek(date: Date, weekStart: number = 1, offset: number = 0): Date {
  // weekStart: 0=Sunday, 1=Monday
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day < weekStart ? -7 : 0) + weekStart + offset * 7;
  return startOfDay(new Date(d.setDate(diff)));
}

export function startOfMonth(date: Date, offset: number = 0): Date {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

export function weeksBetween(start: Date, end: Date): number {
  const msPerWeek = MILLI_SECONDS_IN_A_DAY * 7;
  return Math.floor((startOfDay(end).getTime() - startOfDay(start).getTime()) / msPerWeek);
}

export function monthsBetween(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}
