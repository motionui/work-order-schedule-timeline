// @upgrade Add ARIA roles and labels to timeline and timeline cells for accessibility compliance
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

import { WorkCenterDocument } from '../../../core/models/work-center.model';
import { WorkOrderDocument } from '../../../core/models/work-order.model';
import { WorkOrderStore } from '../../../core/services/work-order.store';
import { TimelineHeader } from './timeline-header/timeline-header';
import { Timescale, TimescaleSelect } from './timescale-select/timescale-select';
import { WorkCenterTimeline } from './work-center-timeline/work-center-timeline';
import { WorkCenter } from './work-center/work-center';

export interface DateRange {
  start: Date;
  end: Date;
}

export const TIMESCALE_UNIT_DAY_WIDTH_PX = 150;
export const TIMESCALE_UNIT_WEEK_WIDTH_PX = 1000;
export const TIMESCALE_UNIT_MONTH_WIDTH_PX = 3500;

// must match $timescale-unit-width-day, $timescale-unit-width-week, $timescale-unit-width-month in _variables.scss
export const TIMESCALE_UNIT_WIDTH_LOOKUP: Record<Timescale, number> = {
  day: TIMESCALE_UNIT_DAY_WIDTH_PX,
  week: TIMESCALE_UNIT_WEEK_WIDTH_PX,
  month: TIMESCALE_UNIT_MONTH_WIDTH_PX,
};

export function getTimescaleUnitWidth(scale: Timescale): number {
  return TIMESCALE_UNIT_WIDTH_LOOKUP[scale];
}

// total horizontal gap between work orders
export const GUTTER_WIDTH_PX = 8;

const VISIBLE_DAYS = 14;
const VISIBLE_WEEKS = 0; // not used, replaced by months for week view
const VISIBLE_MONTHS_WEEK_VIEW = 2; // ±2 months for week view
const VISIBLE_MONTHS_MONTH_VIEW = 6; // ±6 months for month view
const MILLI_SECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TimescaleSelect, WorkCenter, WorkCenterTimeline, TimelineHeader],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timeline implements OnInit, AfterViewInit {
  private readonly store = inject(WorkOrderStore);

  @ViewChild('scrollContainer', { static: false }) private scrollContainer!: ElementRef<HTMLDivElement>;

  // timescale select on work order page
  timescale = signal<Timescale>('day');

  // private readonly today = this.startOfDay(new Date());
  // Add 1 day for correct alignment
  // If your timeline starts at 1/31 and you set today to 2/1, but the slot calculation uses (getDate() - 1),
  // then day 1 of the month (2/1) will be at offset 0, which is the same as the first slot (1/31).
  // This causes the today line to appear on the first visible day, not the actual 2/1 slot.
  private readonly today = this.startOfDay(this.addDays(new Date('2026-02-09'), 1));

  visibleStartDate = computed(() => {
    const scale = this.timescale();
    if (scale === 'week') {
      // Start at the first week of the month, 2 months before today
      const startMonth = this.startOfMonth(this.today, -VISIBLE_MONTHS_WEEK_VIEW);
      // Always align to Monday
      return this.startOfWeek(startMonth, 1);
    } else if (scale === 'month') {
      return this.startOfMonth(this.today, -VISIBLE_MONTHS_MONTH_VIEW);
    }
    return this.addDays(this.today, -VISIBLE_DAYS);
  });

  visibleEndDate = computed(() => {
    const scale = this.timescale();
    if (scale === 'week') {
      // End at the last week of the month, 2 months after today
      const endMonth = this.startOfMonth(this.today, VISIBLE_MONTHS_WEEK_VIEW + 1); // +1 to include the last month
      // Go to the last day of the previous month, then get the week start
      const lastDayPrevMonth = new Date(endMonth.getFullYear(), endMonth.getMonth(), 0);
      return this.startOfWeek(lastDayPrevMonth, 1, 0); // Monday
    } else if (scale === 'month') {
      return this.startOfMonth(this.today, VISIBLE_MONTHS_MONTH_VIEW);
    }
    return this.addDays(this.today, VISIBLE_DAYS);
  });

  totalWidth = computed(() => {
    const { start, end } = this.visibleDateRange();
    const scale = this.timescale();
    let units = 0;
    if (scale === 'week') {
      units = this.weeksBetween(start, end) + 1;
    } else if (scale === 'month') {
      units = this.monthsBetween(start, end) + 1;
    } else {
      units = Math.floor((end.getTime() - start.getTime()) / MILLI_SECONDS_IN_A_DAY) + 1;
    }
    return units * getTimescaleUnitWidth(this.timescale());
  });

  visibleDateRange = computed<DateRange>(() => ({
    start: this.visibleStartDate(),
    end: this.visibleEndDate(),
  }));

  readonly todayIndex = computed(() => {
    const { start, end } = this.visibleDateRange();
    const scale = this.timescale();
    if (this.today < start || this.today > end) {
      return -1; // today not visible
    }
    if (scale === 'week') {
      return this.weeksBetween(start, this.today);
    } else if (scale === 'month') {
      return this.monthsBetween(start, this.today);
    }
    return Math.floor((this.today.getTime() - start.getTime()) / MILLI_SECONDS_IN_A_DAY);
  });

  readonly todayLeft = computed(() => {
    const scale = this.timescale();
    const { start } = this.visibleDateRange();
    if (this.today < start) return -1;
    if (scale === 'week') {
      // Find week index and offset within week
      const weekIndex = this.weeksBetween(start, this.today);
      const weekCellLeft = weekIndex * getTimescaleUnitWidth(scale);
      const weekCellWidth = getTimescaleUnitWidth(scale);
      const slotWidth = weekCellWidth / 7;
      let dayOfWeek = this.today.getDay();
      dayOfWeek = (dayOfWeek + 6) % 7;
      // Position at exact start of slot
      return weekCellLeft + slotWidth * dayOfWeek;
    } else if (scale === 'month') {
      const monthIndex = this.monthsBetween(start, this.today);
      const monthCellLeft = monthIndex * getTimescaleUnitWidth(scale);
      const monthCellWidth = getTimescaleUnitWidth(scale);
      const daysInMonth = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0).getDate();
      const slotWidth = monthCellWidth / daysInMonth;
      const dayOfMonth = this.today.getDate() - 1;
      return monthCellLeft + slotWidth * dayOfMonth;
    } else {
      const index = this.todayIndex();
      if (index < 0) return -1;
      return index * getTimescaleUnitWidth(scale);
    }
  });

  // -----------------------------
  // UI STATE
  // -----------------------------

  hoveredWorkCenter = signal<WorkCenterDocument | null>(null);

  // -----------------------------
  // GROUP WORK ORDERS BY CENTER
  // -----------------------------

  workOrdersGroupByWorkCenters = computed<{ workCenter: WorkCenterDocument; workOrders: WorkOrderDocument[] }[]>(() => {
    const centers = this.store.workCenters$();
    const orders = this.store.workOrders$();

    const map = new Map<string, WorkOrderDocument[]>();

    for (const order of orders) {
      const key = order.data.workCenterId;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(order);
    }

    return centers.map((center) => ({
      workCenter: center,
      workOrders: map.get(center.docId) ?? [],
    }));
  });

  // -----------------------------
  // LIFECYCLE
  // -----------------------------

  ngOnInit(): void {
    this.store.loadSampleData();
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.centerToday();
    });
  }

  private centerToday(): void {
    const container = this.scrollContainer?.nativeElement;
    if (!container) return;

    const range = this.visibleDateRange();
    const today = this.today;

    const daysFromStart = Math.floor((today.getTime() - range.start.getTime()) / MILLI_SECONDS_IN_A_DAY);

    const todayPixel = daysFromStart * getTimescaleUnitWidth(this.timescale());

    const centerOffset = container.clientWidth / 2;

    container.scrollLeft = todayPixel - centerOffset + getTimescaleUnitWidth(this.timescale()) / 2;
  }

  // -----------------------------
  // DATE HELPERS
  // -----------------------------

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return this.startOfDay(d);
  }

  private startOfWeek(date: Date, weekStart: number = 1, offset: number = 0): Date {
    // weekStart: 0=Sunday, 1=Monday
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day < weekStart ? -7 : 0) + weekStart + offset * 7;
    return this.startOfDay(new Date(d.setDate(diff)));
  }

  private startOfMonth(date: Date, offset: number = 0): Date {
    return new Date(date.getFullYear(), date.getMonth() + offset, 1);
  }

  private weeksBetween(start: Date, end: Date): number {
    const msPerWeek = MILLI_SECONDS_IN_A_DAY * 7;
    return Math.floor((this.startOfDay(end).getTime() - this.startOfDay(start).getTime()) / msPerWeek);
  }

  private monthsBetween(start: Date, end: Date): number {
    return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  }
}
