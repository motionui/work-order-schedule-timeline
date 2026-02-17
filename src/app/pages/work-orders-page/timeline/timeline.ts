import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
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

  // edit = output<WorkOrderDocument>();
  // delete = output<WorkOrderDocument>();

  // -----------------------------
  // ZOOM
  // -----------------------------
  zoomLevel = signal<Timescale>('day');

  // -----------------------------
  // DATE RANGE (Single Source of Truth)
  // -----------------------------

  private readonly today = this.startOfDay(new Date());

  // Default 14-day window (±14 from today)
  visibleStartDate = signal(this.addDays(this.today, -14));
  visibleEndDate = signal(this.addDays(this.today, 14));

  totalWidth = computed(() => {
    const { start, end } = this.visibleDateRange();
    const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;

    return days * TIMESCALE_UNIT_WIDTH_PX;
  });

  visibleDateRange = computed<DateRange>(() => ({
    start: this.visibleStartDate(),
    end: this.visibleEndDate(),
  }));

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

  // onEdit(order: WorkOrderDocument) {
  //   this.edit.emit(order);
  // }

  // onDelete(order: WorkOrderDocument) {
  //   this.delete.emit(order);
  // }
}
