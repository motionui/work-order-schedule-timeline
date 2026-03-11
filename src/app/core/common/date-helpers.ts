import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
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

export function daysBetween(start: Date, end: Date): number {
  return Math.floor((startOfDay(end).getTime() - startOfDay(start).getTime()) / MILLI_SECONDS_IN_A_DAY);
}

export function isoToLocalDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function dateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dateToNgbDateStruct(date: Date): NgbDateStruct {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

export function isoToNgbDateStruct(iso: string | null): NgbDateStruct | null {
  if (!iso) {
    return null;
  }

  const [year, month, day] = iso.split('-').map(Number);
  return { year, month, day };
}

export function ngbDateStructToDate(date: NgbDateStruct): Date {
  return new Date(date.year, date.month - 1, date.day);
}

export function ngbDateStructToIso(date: NgbDateStruct | null): string {
  if (!date) {
    return '';
  }

  const mm = String(date.month).padStart(2, '0');
  const dd = String(date.day).padStart(2, '0');
  return `${date.year}-${mm}-${dd}`;
}

export function isoToDisplay(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${month}.${day}.${year}`;
}
