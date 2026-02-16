import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { WorkOrderDocument } from '../../../core/models/work-order.model';
import { WorkCenterDocument } from '../../../core/models/work-center.model';
import { DateRange } from '../timeline/timeline';
import { Timescale } from '../timescale-select/timescale-select';
import { WorkOrder } from '../work-order/work-order';

@Component({
  selector: 'app-work-center-timeline',
  standalone: true,
  imports: [CommonModule, WorkOrder],
  templateUrl: './work-center-timeline.html',
  styleUrl: './work-center-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkCenterTimeline {
  timeScale = input<Timescale>('day');
  dateRange = input.required<DateRange>();
  workCenter = input.required<WorkCenterDocument>();
  workOrders = input.required<WorkOrderDocument[]>();

  edit = output<WorkOrderDocument>();
  delete = output<WorkOrderDocument>();

  private readonly DAY_WIDTH = 120;

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
      const orderStart = new Date(order.data.startDate);
      const orderEnd = new Date(order.data.endDate);

      const clampedStart = orderStart < range.start ? range.start : orderStart;
      const clampedEnd = orderEnd > range.end ? range.end : orderEnd;

      const left = this.daysBetween(range.start, clampedStart) * this.DAY_WIDTH;

      const width = (this.daysBetween(clampedStart, clampedEnd) + 1) * this.DAY_WIDTH;

      return { order, left, width };
    });
  });

  onTimelineClick(event: MouseEvent) {
    const range = this.dateRange();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;

    const dayIndex = Math.floor(x / this.DAY_WIDTH);
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

  onEdit(workOrder: WorkOrderDocument) {
    this.edit.emit(workOrder);
  }

  onDelete(workOrder: WorkOrderDocument) {
    this.delete.emit(workOrder);
  }
}
