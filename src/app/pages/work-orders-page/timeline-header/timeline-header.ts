import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
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

  private today = signal(new Date());

  private startDate = computed(() => {
    const today = this.today();
    const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    switch (this.timeScale()) {
      case 'week':
        return this.addDays(base, -8 * 7);
      case 'month':
        return new Date(base.getFullYear(), base.getMonth() - 6, 1);
      case 'day':
      default:
        return this.addDays(base, -14);
    }
  });

  private endDate = computed(() => {
    const today = this.today();
    const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    switch (this.timeScale()) {
      case 'week':
        return this.addDays(base, 8 * 7);
      case 'month':
        return new Date(base.getFullYear(), base.getMonth() + 6, 1);
      case 'day':
      default:
        return this.addDays(base, 14);
    }
  });

  columns = computed(() => {
    const start = this.startDate();
    const end = this.endDate();
    const scale = this.timeScale();

    const result: Date[] = [];
    let cursor = new Date(start);

    while (cursor <= end) {
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

  label(date: Date): string {
    switch (this.timeScale()) {
      case 'week': {
        const end = this.addDays(date, 6);
        return `${this.formatShort(date)} - ${this.formatShort(end)}`;
      }
      case 'month':
        return date.toLocaleString(undefined, { month: 'short', year: 'numeric' });
      case 'day':
      default:
        return this.formatShort(date);
    }
  }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  private formatShort(date: Date): string {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }
}
