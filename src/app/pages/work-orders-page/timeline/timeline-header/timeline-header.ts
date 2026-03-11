import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { addDays, startOfDay, startOfWeek } from '../../../../core/common/date-helpers';
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
  timescale = input.required<Timescale>();
  dateRange = input.required<DateRange>();

  columns = computed(() => {
    const { start, end } = this.dateRange();
    const scale = this.timescale();

    const result: Date[] = [];

    // For week view, always align cursor to the start of the week (Monday)
    let cursor = scale === 'week' ? startOfWeek(startOfDay(start), 1) : startOfDay(start);
    const rangeEnd = startOfDay(end);

    while (cursor <= rangeEnd) {
      result.push(new Date(cursor));

      switch (scale) {
        case 'week':
          cursor = addDays(cursor, 7);
          break;

        case 'month':
          cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
          break;

        case 'day':
        default:
          cursor = addDays(cursor, 1);
          break;
      }
    }

    return result;
  });

  label(date: Date): string {
    switch (this.timescale()) {
      case 'week': {
        const end = addDays(date, 6);
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

  private formatShort(date: Date): string {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }
}
