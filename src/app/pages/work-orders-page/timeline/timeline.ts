import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timescale, TimescaleSelect } from './timescale-select/timescale-select';
import { WorkCenter } from './work-center/work-center';
import { WorkCenterDocument } from '../../../core/models/work-center.model';
import { WorkOrderStore } from '../../../core/services/work-order.store';
import { WorkCenterTimeline } from './work-center-timeline/work-center-timeline';
import { WorkOrderDocument } from '../../../core/models/work-order.model';
import { TimelineHeader } from './timeline-header/timeline-header';

export interface DateRange {
  start: Date;
  end: Date;
}

// must match $work-order-timeline-cell-width in _variables.scss
export const TIMESCALE_UNIT_WIDTH_PX = 150;
// total horizontal gap between work orders
export const GUTTER_WIDTH_PX = 8;

const VISIBLE_DAYS = 14;
const VISIBLE_WEEKS = 8;
const VISIBLE_MONTHS = 6;
const MILLI_SECONDS_IN_DAY = 1000 * 60 * 60 * 24;

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TimescaleSelect, WorkCenter, WorkCenterTimeline, TimelineHeader],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timeline implements OnInit {
  private readonly store = inject(WorkOrderStore);

  @ViewChild('scrollContainer', { static: false }) private scrollContainer!: ElementRef<HTMLDivElement>;

  // -----------------------------
  // ZOOM
  // -----------------------------
  zoomLevel = signal<Timescale>('day');

  private readonly centerOnZoomLevel = effect(() => {
    this.zoomLevel();
    requestAnimationFrame(() => this.centerToday());
  });

  // -----------------------------
  // DATE RANGE (Single Source of Truth)
  // -----------------------------

  private readonly today = this.startOfDay(new Date());

  visibleStartDate = computed(() => {
    const scale = this.zoomLevel();
    if (scale === 'week') {
      return this.startOfWeek(this.today, 1, -VISIBLE_WEEKS); // Monday
    } else if (scale === 'month') {
      return this.startOfMonth(this.today, -VISIBLE_MONTHS);
    }
    return this.addDays(this.today, -VISIBLE_DAYS);
  });

  visibleEndDate = computed(() => {
    const scale = this.zoomLevel();
    if (scale === 'week') {
      return this.startOfWeek(this.today, 1, VISIBLE_WEEKS);
    } else if (scale === 'month') {
      return this.startOfMonth(this.today, VISIBLE_MONTHS);
    }
    return this.addDays(this.today, VISIBLE_DAYS);
  });

  totalWidth = computed(() => {
    const { start, end } = this.visibleDateRange();
    const scale = this.zoomLevel();
    let units = 0;
    if (scale === 'week') {
      units = this.weeksBetween(start, end) + 1;
    } else if (scale === 'month') {
      units = this.monthsBetween(start, end) + 1;
    } else {
      units = Math.floor((end.getTime() - start.getTime()) / MILLI_SECONDS_IN_DAY) + 1;
    }
    return units * TIMESCALE_UNIT_WIDTH_PX;
  });

  visibleDateRange = computed<DateRange>(() => ({
    start: this.visibleStartDate(),
    end: this.visibleEndDate(),
  }));

  readonly todayIndex = computed(() => {
    const { start, end } = this.visibleDateRange();
    const scale = this.zoomLevel();
    if (this.today < start || this.today > end) {
      return -1; // today not visible
    }
    if (scale === 'week') {
      return this.weeksBetween(start, this.today);
    } else if (scale === 'month') {
      return this.monthsBetween(start, this.today);
    }
    return Math.floor((this.today.getTime() - start.getTime()) / MILLI_SECONDS_IN_DAY);
  });

  readonly todayLeft = computed(() => {
    const index = this.todayIndex();
    if (index < 0) return -1;
    return index * TIMESCALE_UNIT_WIDTH_PX;
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

  // ngAfterViewInit(): void {
  //   requestAnimationFrame(() => {
  //     this.centerToday();
  //   });
  // }

  private centerToday(): void {
    const container = this.scrollContainer?.nativeElement;
    if (!container) return;

    const range = this.visibleDateRange();
    const today = this.today;

    const daysFromStart = Math.floor((today.getTime() - range.start.getTime()) / MILLI_SECONDS_IN_DAY);

    const todayPixel = daysFromStart * TIMESCALE_UNIT_WIDTH_PX;

    const centerOffset = container.clientWidth / 2;

    container.scrollLeft = todayPixel - centerOffset + TIMESCALE_UNIT_WIDTH_PX / 2;
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
    const msPerWeek = MILLI_SECONDS_IN_DAY * 7;
    return Math.floor((this.startOfDay(end).getTime() - this.startOfDay(start).getTime()) / msPerWeek);
  }

  private monthsBetween(start: Date, end: Date): number {
    return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  }

  // onEdit(order: WorkOrderDocument) {
  //   this.edit.emit(order);
  // }

  // onDelete(order: WorkOrderDocument) {
  //   this.delete.emit(order);
  // }
}
