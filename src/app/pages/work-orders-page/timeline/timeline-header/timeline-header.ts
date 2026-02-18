// @upgrade Add ARIA roles and labels to timeline header for screen reader support
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DateRange } from '../timeline';
import { Timescale } from '../timescale-select/timescale-select';

@Component({
  selector: 'app-timeline-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-header.html',
  styleUrl: './timeline-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineHeader {
  timeScale = input<Timescale>('day');
  dateRange = input.required<DateRange>();

  columns = computed(() => {
    const { start, end } = this.dateRange();
    const scale = this.timeScale();

    const result: Date[] = [];

    // For week view, always align cursor to the start of the week (Monday)
    let cursor = scale === 'week' ? this.startOfWeek(this.startOfDay(start), 1) : this.startOfDay(start);
    const rangeEnd = this.startOfDay(end);

    while (cursor <= rangeEnd) {
      result.push(new Date(cursor));

      switch (scale) {
        case 'week':
          cursor = this.addDays(cursor, 7);
          break;

        case 'month':
          cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
          break;

        case 'day':
        default:
          cursor = this.addDays(cursor, 1);
          break;
      }
    }

    return result;
  });

  private startOfWeek(date: Date, weekStart: number = 1): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day < weekStart ? -7 : 0) + weekStart;
    return new Date(d.setDate(diff));
  }

  label(date: Date): string {
    switch (this.timeScale()) {
      case 'week': {
        const end = this.addDays(date, 6);
        return `${this.formatShort(date)} - ${this.formatShort(end)}`;
      }

      case 'month':
        return date.toLocaleString(undefined, {
          month: 'short',
          year: 'numeric',
        });

      case 'day':
      default:
        return this.formatShort(date);
    }
  }

  // -----------------------------
  // Helpers
  // -----------------------------

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return this.startOfDay(d);
  }

  private formatShort(date: Date): string {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }
}
