// @upgrade Add ARIA roles and labels to work center timeline and work order bars for accessibility
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkCenterDocument } from '../../../../core/models/work-center.model';
import { WorkOrderDocument } from '../../../../core/models/work-order.model';
import { WorkOrderDrawerService } from '../../../../core/services/work-order-drawer.service';
import { WorkOrderStore } from '../../../../core/services/work-order.store';
import { DateRange, GUTTER_WIDTH_PX, TIMESCALE_UNIT_WIDTH_PX } from '../timeline';
import { Timescale } from '../timescale-select/timescale-select';
import { WorkOrder } from './work-order/work-order';

@Component({
  selector: 'app-work-center-timeline',
  standalone: true,
  imports: [CommonModule, WorkOrder, NgbTooltipModule],
  templateUrl: './work-center-timeline.html',
  styleUrl: './work-center-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkCenterTimeline {
  private workOrderDrawerService = inject(WorkOrderDrawerService);
  private workOrderStore = inject(WorkOrderStore);

  timeScale = input<Timescale>('day');
  dateRange = input.required<DateRange>();
  workCenter = input.required<WorkCenterDocument>();
  workOrders = input.required<WorkOrderDocument[]>();

  hoveredDayIndex = signal<number | null>(null);

  hoverPreview = computed(() => {
    const index = this.hoveredDayIndex();
    if (index === null) return null;

    const clickedDate = this.addDays(this.dateRange().start, index);

    const isOccupied = this.visibleOrders().some((order) => {
      const start = this.toLocalDate(order.data.startDate);
      const end = this.toLocalDate(order.data.endDate);
      return clickedDate >= start && clickedDate <= end;
    });

    if (isOccupied) return null;

    return {
      left: index * TIMESCALE_UNIT_WIDTH_PX + GUTTER_WIDTH_PX / 2,
      width: TIMESCALE_UNIT_WIDTH_PX - GUTTER_WIDTH_PX,
    };
  });

  visibleOrders = computed(() => {
    const { start, end } = this.dateRange();
    const scale = this.timeScale();
    return this.workOrders().filter((order) => {
      const s = new Date(order.data.startDate);
      const e = new Date(order.data.endDate);
      // For week/month, show if any overlap with the interval
      return e >= start && s <= end;
    });
  });

  positionedOrders = computed(() => {
    const range = this.dateRange();
    const scale = this.timeScale();

    return this.visibleOrders().map((order) => {
      const orderStart = this.toLocalDate(order.data.startDate);
      const orderEnd = this.toLocalDate(order.data.endDate);

      let clampedStart = orderStart < range.start ? range.start : orderStart;
      let clampedEnd = orderEnd > range.end ? range.end : orderEnd;

      let left = 0;
      let width = 0;

      if (scale === 'week') {
        left = this.weeksBetween(range.start, clampedStart) * TIMESCALE_UNIT_WIDTH_PX + GUTTER_WIDTH_PX / 2;
        width = (this.weeksBetween(clampedStart, clampedEnd) + 1) * TIMESCALE_UNIT_WIDTH_PX - GUTTER_WIDTH_PX - 1;
      } else if (scale === 'month') {
        left = this.monthsBetween(range.start, clampedStart) * TIMESCALE_UNIT_WIDTH_PX + GUTTER_WIDTH_PX / 2;
        width = (this.monthsBetween(clampedStart, clampedEnd) + 1) * TIMESCALE_UNIT_WIDTH_PX - GUTTER_WIDTH_PX - 1;
      } else {
        left = this.daysBetween(range.start, clampedStart) * TIMESCALE_UNIT_WIDTH_PX + GUTTER_WIDTH_PX / 2;
        width = (this.daysBetween(clampedStart, clampedEnd) + 1) * TIMESCALE_UNIT_WIDTH_PX - GUTTER_WIDTH_PX - 1;
      }

      return { order, left, width };
    });
  });

  private weeksBetween(start: Date, end: Date): number {
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor((this.startOfDay(end).getTime() - this.startOfDay(start).getTime()) / msPerWeek);
  }

  private monthsBetween(start: Date, end: Date): number {
    return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  onTimelineClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('.work-order-wrapper')) {
      return;
    }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;

    const adjustedX = x - GUTTER_WIDTH_PX / 2;
    const dayIndex = Math.floor(adjustedX / TIMESCALE_UNIT_WIDTH_PX);
    if (dayIndex < 0) return;
    const clickedDate = this.addDays(this.dateRange().start, dayIndex);

    // only create if no order occupies this day
    const isOccupied = this.visibleOrders().some((order) => {
      const start = this.toLocalDate(order.data.startDate);
      const end = this.toLocalDate(order.data.endDate);
      return clickedDate >= start && clickedDate <= end;
    });

    if (isOccupied) return;

    this.workOrderDrawerService.openDrawer({
      mode: 'create',
      workOrder: {
        docId: crypto.randomUUID(),
        docType: 'workOrder',
        data: {
          name: '',
          workCenterId: this.workCenter().docId,
          status: 'open',
          startDate: this.toIso(clickedDate),
          endDate: this.toIso(clickedDate),
        },
      },
      currentWorkOrders: this.workOrders(),
    });
  }

  private toIso(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  onMouseMove(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;

    const adjustedX = x - GUTTER_WIDTH_PX / 2;
    const dayIndex = Math.floor(adjustedX / TIMESCALE_UNIT_WIDTH_PX);
    if (dayIndex < 0) {
      this.hoveredDayIndex.set(null);
      return;
    }
    this.hoveredDayIndex.set(dayIndex);
  }

  onMouseLeave() {
    this.hoveredDayIndex.set(null);
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
