// Constants for timeline layout
const MONTH_LEFT_PADDING = 4;
const MONTH_RIGHT_PADDING = 4;
const MONTH_GAP = 2;
// @upgrade Add ARIA roles and labels to work center timeline and work order bars for accessibility
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkCenterDocument } from '../../../../core/models/work-center.model';
import { WorkOrderDocument } from '../../../../core/models/work-order.model';
import { WorkOrderDrawerService } from '../../../../core/services/work-order-drawer.service';
import { WorkOrderStore } from '../../../../core/services/work-order.store';
import { DateRange, getTimescaleUnitWidth, GUTTER_WIDTH_PX } from '../timeline';
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

  timescale = input<Timescale>('day');
  dateRange = input.required<DateRange>();
  workCenter = input.required<WorkCenterDocument>();
  workOrders = input.required<WorkOrderDocument[]>();

  hoveredDayIndex = signal<number | null>(null);

  hoverPreview = computed(() => {
    const index = this.hoveredDayIndex();
    if (index === null) return null;

    const scale = this.timescale();
    const rangeStart = this.dateRange().start;
    let clickedDate: Date;
    let left = 0;
    let width = 0;

    if (scale === 'week') {
      clickedDate = this.addDays(rangeStart, index);
      const weekIndex = Math.floor(index / 7);
      const dayOfWeek = index % 7;
      const weekCellLeft = weekIndex * getTimescaleUnitWidth(scale) + GUTTER_WIDTH_PX / 2;
      const weekCellWidth = getTimescaleUnitWidth(scale) - GUTTER_WIDTH_PX;
      const slotWidth = weekCellWidth / 7;
      // @upgrade Find out exactly why we need to add hacky 6px to align the hover preview with the work order bars in week view, and remove this magic number if possible
      left = weekCellLeft + slotWidth * dayOfWeek + 6;
      width = slotWidth - 11;
    } else if (scale === 'month') {
      clickedDate = this.addDays(rangeStart, index);
      const monthIndex =
        clickedDate.getFullYear() * 12 + clickedDate.getMonth() - (rangeStart.getFullYear() * 12 + rangeStart.getMonth());
      const monthCellLeft = monthIndex * getTimescaleUnitWidth(scale) + GUTTER_WIDTH_PX / 2;
      const monthCellWidth = getTimescaleUnitWidth(scale) - GUTTER_WIDTH_PX;
      const daysInMonth = new Date(clickedDate.getFullYear(), clickedDate.getMonth() + 1, 0).getDate();
      const dayOfMonth = clickedDate.getDate() - 1;
      const slotWidth = monthCellWidth / daysInMonth;
      // For hoverPreview, treat as single-day slot, match bar logic
      // Add 2px extra spacing to separate preview from today's line
      left = Math.round(monthCellLeft + slotWidth * dayOfMonth + MONTH_LEFT_PADDING + 6);
      width = Math.round(slotWidth - MONTH_LEFT_PADDING - MONTH_RIGHT_PADDING - 10);
    } else {
      // day
      clickedDate = this.addDays(rangeStart, index);
      left = index * getTimescaleUnitWidth(scale) + GUTTER_WIDTH_PX / 2 + 4;
      width = getTimescaleUnitWidth(scale) - GUTTER_WIDTH_PX - 8;
    }

    // Only allow today or future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const slotDate = new Date(clickedDate);
    slotDate.setHours(0, 0, 0, 0);
    if (slotDate < today) return null;

    const isOccupied = this.visibleOrders().some((order) => {
      const start = this.toLocalDate(order.data.startDate);
      const end = this.toLocalDate(order.data.endDate);
      return clickedDate >= start && clickedDate <= end;
    });

    if (isOccupied) return null;

    return {
      left,
      width,
    };
  });

  visibleOrders = computed(() => {
    const { start, end } = this.dateRange();
    const scale = this.timescale();
    return this.workOrders().filter((order) => {
      const s = new Date(order.data.startDate);
      const e = new Date(order.data.endDate);
      // For week/month, show if any overlap with the interval
      return e >= start && s <= end;
    });
  });

  positionedOrders = computed(() => {
    const range = this.dateRange();
    const scale = this.timescale();

    // For week view, group orders by week start
    if (scale === 'week') {
      // ...existing code for week view...
      const weekGroups = new Map<string, WorkOrderDocument[]>();
      for (const order of this.visibleOrders()) {
        const orderStart = this.toLocalDate(order.data.startDate);
        const weekStart = this.startOfWeek(orderStart, 1);
        const key = weekStart.toISOString();
        if (!weekGroups.has(key)) weekGroups.set(key, []);
        weekGroups.get(key)!.push(order);
      }
      const result: { order: WorkOrderDocument; left: number; width: number }[] = [];
      for (const [weekKey, orders] of weekGroups.entries()) {
        const weekStart = new Date(weekKey);
        const weekIndex = this.weeksBetween(range.start, weekStart);
        const weekCellLeft = weekIndex * getTimescaleUnitWidth(scale) + GUTTER_WIDTH_PX / 2;
        const weekCellWidth = getTimescaleUnitWidth(scale) - GUTTER_WIDTH_PX;
        const slotWidth = weekCellWidth / 7;
        for (const order of orders) {
          const orderStart = this.toLocalDate(order.data.startDate);
          const orderEnd = this.toLocalDate(order.data.endDate);
          // Clamp to this week
          const weekStartDay = weekStart.getDate();
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStartDay + 6);
          const clampedStart = orderStart < weekStart ? weekStart : orderStart;
          const clampedEnd = orderEnd > weekEnd ? weekEnd : orderEnd;
          // Day of week: 0=Monday, 6=Sunday
          let startDayOfWeek = clampedStart.getDay();
          let endDayOfWeek = clampedEnd.getDay();
          startDayOfWeek = (startDayOfWeek + 6) % 7;
          endDayOfWeek = (endDayOfWeek + 6) % 7;
          // Add spacing between adjacent work orders (2px gap between slots)
          const slotCount = endDayOfWeek - startDayOfWeek + 1;
          const gap = 2;
          const left = weekCellLeft + slotWidth * startDayOfWeek;
          const width = slotWidth * slotCount - gap * (slotCount - 1);
          result.push({ order, left, width });
        }
      }
      return result;
    }
    // For month view, group orders by month start
    if (scale === 'month') {
      // Group orders by month start date string
      const monthGroups = new Map<string, WorkOrderDocument[]>();
      for (const order of this.visibleOrders()) {
        const orderStart = this.toLocalDate(order.data.startDate);
        const monthStart = new Date(orderStart.getFullYear(), orderStart.getMonth(), 1);
        const key = monthStart.toISOString();
        if (!monthGroups.has(key)) monthGroups.set(key, []);
        monthGroups.get(key)!.push(order);
      }
      const result: { order: WorkOrderDocument; left: number; width: number }[] = [];
      for (const [monthKey, orders] of monthGroups.entries()) {
        const monthStart = new Date(monthKey);
        const monthIndex = this.monthsBetween(range.start, monthStart);
        const monthCellLeft = monthIndex * getTimescaleUnitWidth(scale) + GUTTER_WIDTH_PX / 2;
        const monthCellWidth = getTimescaleUnitWidth(scale) - GUTTER_WIDTH_PX;
        // Number of days in this month
        const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
        const slotWidth = monthCellWidth / daysInMonth;
        for (const order of orders) {
          const orderStart = this.toLocalDate(order.data.startDate);
          const orderEnd = this.toLocalDate(order.data.endDate);
          // Clamp to this month
          const clampedStart = orderStart < monthStart ? monthStart : orderStart;
          const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
          const clampedEnd = orderEnd > monthEnd ? monthEnd : orderEnd;
          const startDayOfMonth = clampedStart.getDate() - 1; // 0-based
          const endDayOfMonth = clampedEnd.getDate() - 1; // 0-based
          // Add spacing between adjacent work orders
          const slotCount = endDayOfMonth - startDayOfMonth + 1;
          const left = Math.round(monthCellLeft + slotWidth * startDayOfMonth + MONTH_LEFT_PADDING);
          const width =
            slotCount === 1
              ? Math.round(slotWidth - MONTH_LEFT_PADDING - MONTH_RIGHT_PADDING)
              : Math.round(slotWidth * slotCount - MONTH_GAP * (slotCount - 1) - MONTH_LEFT_PADDING - MONTH_RIGHT_PADDING);
          result.push({ order, left, width });
        }
      }
      return result;
    }
    // Day view: unchanged
    return this.visibleOrders().map((order) => {
      const orderStart = this.toLocalDate(order.data.startDate);
      const orderEnd = this.toLocalDate(order.data.endDate);

      let clampedStart = orderStart < range.start ? range.start : orderStart;
      let clampedEnd = orderEnd > range.end ? range.end : orderEnd;

      let left = 0;
      let width = 0;

      left = this.daysBetween(range.start, clampedStart) * getTimescaleUnitWidth(this.timescale()) + GUTTER_WIDTH_PX / 2;
      width = (this.daysBetween(clampedStart, clampedEnd) + 1) * getTimescaleUnitWidth(this.timescale()) - GUTTER_WIDTH_PX - 1;

      return { order, left, width };
    });
  });

  // Helper to get the start of the week (Monday by default)
  private startOfWeek(date: Date, weekStart: number = 1): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day < weekStart ? -7 : 0) + weekStart;
    return new Date(d.setDate(diff));
  }

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
    const scale = this.timescale();
    let dayIndex = null;
    if (scale === 'week') {
      const weekCellWidth = getTimescaleUnitWidth(scale);
      const weekIndex = Math.floor(x / weekCellWidth);
      const weekCellLeft = weekIndex * weekCellWidth;
      const slotWidth = (weekCellWidth - GUTTER_WIDTH_PX) / 7;
      const dayOfWeek = Math.floor((x - weekCellLeft - GUTTER_WIDTH_PX / 2) / slotWidth);
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        return;
      }
      dayIndex = weekIndex * 7 + dayOfWeek;
    } else if (scale === 'month') {
      const monthCellWidth = getTimescaleUnitWidth(scale);
      const monthIndex = Math.floor(x / monthCellWidth);
      const monthCellLeft = monthIndex * monthCellWidth;
      const rangeStart = this.dateRange().start;
      const refDate = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + monthIndex, 1);
      const daysInMonth = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0).getDate();
      const slotWidth = (monthCellWidth - GUTTER_WIDTH_PX) / daysInMonth;
      const dayOfMonth = Math.floor((x - monthCellLeft - GUTTER_WIDTH_PX / 2) / slotWidth);
      if (dayOfMonth < 0 || dayOfMonth >= daysInMonth) {
        return;
      }
      dayIndex = 0;
      for (let i = 0; i < monthIndex; i++) {
        const d = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + i + 1, 0).getDate();
        dayIndex += d;
      }
      dayIndex += dayOfMonth;
    } else {
      const adjustedX = x - GUTTER_WIDTH_PX / 2;
      const idx = Math.floor(adjustedX / getTimescaleUnitWidth(scale));
      if (idx < 0) {
        return;
      }
      dayIndex = idx;
    }
    const rangeStart = this.dateRange().start;
    const clickedDate = this.addDays(rangeStart, dayIndex);
    // Only allow today or future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (clickedDate < today) return;
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
          endDate: this.toIso(this.addDays(clickedDate, 7)),
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
    const scale = this.timescale();
    let dayIndex = null;
    if (scale === 'week') {
      // Find which week cell
      const weekCellWidth = getTimescaleUnitWidth(scale);
      const weekIndex = Math.floor(x / weekCellWidth);
      const weekCellLeft = weekIndex * weekCellWidth;
      const slotWidth = (weekCellWidth - GUTTER_WIDTH_PX) / 7;
      const dayOfWeek = Math.floor((x - weekCellLeft - GUTTER_WIDTH_PX / 2) / slotWidth);
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        this.hoveredDayIndex.set(null);
        return;
      }
      // Calculate global day index from visible range start
      dayIndex = weekIndex * 7 + dayOfWeek;
    } else if (scale === 'month') {
      // Find which month cell
      const monthCellWidth = getTimescaleUnitWidth(scale);
      const monthIndex = Math.floor(x / monthCellWidth);
      const monthCellLeft = monthIndex * monthCellWidth;
      const rangeStart = this.dateRange().start;
      // Get days in this month
      const refDate = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + monthIndex, 1);
      const daysInMonth = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0).getDate();
      const slotWidth = (monthCellWidth - GUTTER_WIDTH_PX) / daysInMonth;
      const dayOfMonth = Math.floor((x - monthCellLeft - GUTTER_WIDTH_PX / 2) / slotWidth);
      if (dayOfMonth < 0 || dayOfMonth >= daysInMonth) {
        this.hoveredDayIndex.set(null);
        return;
      }
      // Calculate global day index from visible range start
      dayIndex = 0;
      for (let i = 0; i < monthIndex; i++) {
        const d = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + i + 1, 0).getDate();
        dayIndex += d;
      }
      dayIndex += dayOfMonth;
    } else {
      // day view
      const adjustedX = x - GUTTER_WIDTH_PX / 2;
      const idx = Math.floor(adjustedX / getTimescaleUnitWidth(scale));
      if (idx < 0) {
        this.hoveredDayIndex.set(null);
        return;
      }
      dayIndex = idx;
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
