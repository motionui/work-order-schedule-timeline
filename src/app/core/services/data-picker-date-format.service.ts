import { Injectable } from '@angular/core';

import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class DataPickerDateFormatService extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (!value) return null;

    const parts = value.split('.');
    if (parts.length !== 3) return null;

    const month = Number(parts[0]);
    const day = Number(parts[1]);
    const year = Number(parts[2]);

    if (!month || !day || !year) return null;

    return { year, month, day };
  }

  format(date: NgbDateStruct | null): string {
    if (!date) return '';

    const month = this.pad(date.month);
    const day = this.pad(date.day);
    const year = date.year;

    return `${month}.${day}.${year}`;
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
