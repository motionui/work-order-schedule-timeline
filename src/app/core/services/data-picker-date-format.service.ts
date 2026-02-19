/**
 * Service to handle date parsing and formatting for the ngb date picker component
 */

import { Injectable } from '@angular/core';

import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class DataPickerDateFormatService extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (!value) {
      return null;
    }

    const parts = value.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [month, day, year] = parts;
    if (!month || !day || !year) {
      return null;
    }

    return { year: +year, month: +month, day: +day };
  }

  format(date: NgbDateStruct | null): string {
    if (!date) {
      return '';
    }

    const month = String(date.month).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');
    const year = date.year;

    return `${month}.${day}.${year}`;
  }
}
