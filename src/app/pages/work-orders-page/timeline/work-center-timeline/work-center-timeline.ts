import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { WorkOrderDocument } from '../../../../core/models/work-order.model';
import { DateRange } from '../timeline';
import { Timescale } from '../timescale-select/timescale-select';
import { WorkOrderDrawerService } from '../../../../core/services/work-order-drawer.service';
import { WorkOrderStore } from '../../../../core/services/work-order.store';
import { WorkOrder } from './work-order/work-order';

// must match $work-order-timeline-cell-width in _variables.scss
const TIMESCALE_UNIT_WIDTH = 150;
// total horizontal gap between work orders
const GUTTER = 8;

@Component({
  selector: 'app-work-center-timeline',
  standalone: true,
  imports: [CommonModule, WorkOrder],
  templateUrl: './work-center-timeline.html',
  styleUrl: './work-center-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkCenterTimeline {
  private workOrderDrawerService = inject(WorkOrderDrawerService);
  private workOrderStore = inject(WorkOrderStore);

  timeScale = input<Timescale>('day');
  dateRange = input.required<DateRange>();
  workOrders = input.required<WorkOrderDocument[]>();

  visibleOrders = computed(() => {
    const { start, end } = this.dateRange();
    return this.workOrders().filter((order) => {
      const s = new Date(order.data.startDate);
      const e = new Date(order.data.endDate);
      return e >= start && s <= end;
    });
  });

  positionedOrders = computed(() => {
    const range = this.dateRange();

    return this.visibleOrders().map((order) => {
      const orderStart = this.toLocalDate(order.data.startDate);
      const orderEnd = this.toLocalDate(order.data.endDate);

      const clampedStart = orderStart < range.start ? range.start : orderStart;
      const clampedEnd = orderEnd > range.end ? range.end : orderEnd;

      const left = this.daysBetween(range.start, clampedStart) * TIMESCALE_UNIT_WIDTH + GUTTER / 2;
      const width = (this.daysBetween(clampedStart, clampedEnd) + 1) * TIMESCALE_UNIT_WIDTH - GUTTER - 1;

      return { order, left, width };
    });
  });

  onTimelineClick(event: MouseEvent) {
    const range = this.dateRange();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;

    const dayIndex = Math.floor(x / TIMESCALE_UNIT_WIDTH);
    const clickedDate = this.addDays(range.start, dayIndex);

    console.log('Create work order on:', clickedDate);
  }

  private daysBetween(a: Date, b: Date): number {
    const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((end.getTime() - start.getTime()) / 86400000);
  }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  private toLocalDate(iso: string): Date {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  onEdit(workOrder: WorkOrderDocument) {
    this.workOrderDrawerService.openDrawer({
      mode: 'edit',
      workOrder,
      currentWorkOrders: this.workOrders(),
    });
  }

  onDelete(workOrder: WorkOrderDocument) {
    this.workOrderStore.delete(workOrder);
  }
}
