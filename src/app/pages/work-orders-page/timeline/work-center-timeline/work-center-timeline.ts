/**
 * Component to display the timeline for a work center, including the timeline header with the timescale and date range, and the work orders for that center displayed in the timeline
 */

/**
 * @upgrade Add ARIA roles and labels to timeline and timeline cells for accessibility compliance
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  addDays,
  dateToIso,
  daysBetween,
  daysInMonth,
  isoToLocalDate,
  monthsBetween,
  startOfDay,
  startOfWeek,
  weeksBetween,
} from '../../../../core/common/date-helpers';
import { getTimescaleUnitWidth } from '../../../../core/common/timescale-helpers';
import { WorkCenterDocument } from '../../../../core/models/work-center.model';
import { WorkOrderDocument } from '../../../../core/models/work-order.model';
import { WorkOrderDrawerService } from '../../../../core/services/work-order-drawer.service';
import { WorkOrderStore } from '../../../../core/services/work-order.store';
import { DateRange } from '../timeline';
import { Timescale } from '../timescale-select/timescale-select';
import { WorkOrder } from './work-order/work-order';

// Constants for timeline layout
const ITEM_LEFT_GAP_PX = 4;
const ITEM_RIGHT_GAP_PX = 5;

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

  timescale = input.required<Timescale>();
  dateRange = input.required<DateRange>();
  workCenter = input.required<WorkCenterDocument>();
  workOrders = input.required<WorkOrderDocument[]>();

  hoveredDayIndex = signal<number | null>(null);

  private buildRect(startPx: number, endPx: number): { left: number; width: number } {
    const start = Math.round(startPx);
    const end = Math.round(endPx);
    return {
      left: start + ITEM_LEFT_GAP_PX,
      width: Math.max(0, end - start - ITEM_LEFT_GAP_PX - ITEM_RIGHT_GAP_PX),
    };
  }

  hoverPreview = computed(() => {
    const index = this.hoveredDayIndex();
    if (index === null) return null;

    const scale = this.timescale();
    const rangeStart = this.dateRange().start;
    let clickedDate: Date;
    let left = 0;
    let width = 0;
    const unitWidth = getTimescaleUnitWidth(scale);

    if (scale === 'week') {
      clickedDate = addDays(rangeStart, index);
      const weekIndex = Math.floor(index / 7);
      const dayOfWeek = index % 7;
      const weekCellLeft = weekIndex * unitWidth;
      const slotWidth = unitWidth / 7;
      const rect = this.buildRect(weekCellLeft + slotWidth * dayOfWeek, weekCellLeft + slotWidth * (dayOfWeek + 1));
      left = rect.left;
      width = rect.width;
    } else if (scale === 'month') {
      clickedDate = addDays(rangeStart, index);
      const monthIndex =
        clickedDate.getFullYear() * 12 + clickedDate.getMonth() - (rangeStart.getFullYear() * 12 + rangeStart.getMonth());
      const monthCellLeft = monthIndex * unitWidth;
      const totalDaysInMonth = daysInMonth(clickedDate);
      const dayOfMonth = clickedDate.getDate() - 1;
      const slotWidth = unitWidth / totalDaysInMonth;
      const rect = this.buildRect(monthCellLeft + slotWidth * dayOfMonth, monthCellLeft + slotWidth * (dayOfMonth + 1));
      left = rect.left;
      width = rect.width;
    } else {
      // day
      clickedDate = addDays(rangeStart, index);
      const dayStart = index * unitWidth;
      const rect = this.buildRect(dayStart, dayStart + unitWidth);
      left = rect.left;
      width = rect.width;
    }

    // Only allow today or future
    const today = startOfDay(new Date());
    const slotDate = startOfDay(clickedDate);
    if (slotDate < today) return null;

    const isOccupied = this.visibleOrders().some((order) => {
      const start = isoToLocalDate(order.data.startDate);
      const end = isoToLocalDate(order.data.endDate);
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
      const s = isoToLocalDate(order.data.startDate);
      const e = isoToLocalDate(order.data.endDate);
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
      const weekGroups = new Map<number, WorkOrderDocument[]>();
      for (const order of this.visibleOrders()) {
        const orderStart = isoToLocalDate(order.data.startDate);
        const weekStartDate = startOfWeek(orderStart, 1);
        const key = weekStartDate.getTime();
        if (!weekGroups.has(key)) weekGroups.set(key, []);
        weekGroups.get(key)!.push(order);
      }
      const result: { order: WorkOrderDocument; left: number; width: number }[] = [];
      for (const [weekKey, orders] of weekGroups.entries()) {
        const weekStart = new Date(weekKey);
        const weekIndex = weeksBetween(range.start, weekStart);
        const unitWidth = getTimescaleUnitWidth(scale);
        const weekCellLeft = weekIndex * unitWidth;
        const slotWidth = unitWidth / 7;
        for (const order of orders) {
          const orderStart = isoToLocalDate(order.data.startDate);
          const orderEnd = isoToLocalDate(order.data.endDate);
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
          const rect = this.buildRect(weekCellLeft + slotWidth * startDayOfWeek, weekCellLeft + slotWidth * (endDayOfWeek + 1));
          const left = rect.left;
          const width = rect.width;
          result.push({ order, left, width });
        }
      }
      return result;
    }
    // For month view, group orders by month start
    if (scale === 'month') {
      // Group orders by month start date string
      const monthGroups = new Map<number, WorkOrderDocument[]>();
      for (const order of this.visibleOrders()) {
        const orderStart = isoToLocalDate(order.data.startDate);
        const monthStart = new Date(orderStart.getFullYear(), orderStart.getMonth(), 1);
        const key = monthStart.getTime();
        if (!monthGroups.has(key)) monthGroups.set(key, []);
        monthGroups.get(key)!.push(order);
      }
      const result: { order: WorkOrderDocument; left: number; width: number }[] = [];
      for (const [monthKey, orders] of monthGroups.entries()) {
        const monthStart = new Date(monthKey);
        const monthIndex = monthsBetween(range.start, monthStart);
        const unitWidth = getTimescaleUnitWidth(scale);
        const monthCellLeft = monthIndex * unitWidth;
        // Number of days in this month
        const totalDaysInMonth = daysInMonth(monthStart);
        const slotWidth = unitWidth / totalDaysInMonth;
        for (const order of orders) {
          const orderStart = isoToLocalDate(order.data.startDate);
          const orderEnd = isoToLocalDate(order.data.endDate);
          // Clamp to this month
          const clampedStart = orderStart < monthStart ? monthStart : orderStart;
          const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
          const clampedEnd = orderEnd > monthEnd ? monthEnd : orderEnd;
          const startDayOfMonth = clampedStart.getDate() - 1; // 0-based
          const endDayOfMonth = clampedEnd.getDate() - 1; // 0-based
          const rect = this.buildRect(
            monthCellLeft + slotWidth * startDayOfMonth,
            monthCellLeft + slotWidth * (endDayOfMonth + 1),
          );
          const left = rect.left;
          const width = rect.width;
          result.push({ order, left, width });
        }
      }
      return result;
    }
    // Day view: unchanged
    return this.visibleOrders().map((order) => {
      const orderStart = isoToLocalDate(order.data.startDate);
      const orderEnd = isoToLocalDate(order.data.endDate);

      let clampedStart = orderStart < range.start ? range.start : orderStart;
      let clampedEnd = orderEnd > range.end ? range.end : orderEnd;

      let left = 0;
      let width = 0;

      const unitWidth = getTimescaleUnitWidth(this.timescale());
      const startPx = daysBetween(range.start, clampedStart) * unitWidth;
      const endPx = (daysBetween(range.start, clampedStart) + daysBetween(clampedStart, clampedEnd) + 1) * unitWidth;
      const rect = this.buildRect(startPx, endPx);
      left = rect.left;
      width = rect.width;

      return { order, left, width };
    });
  });

  onTimelineClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('.work-order-wrapper')) {
      return;
    }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const scale = this.timescale();
    let dayIndex = null;
    const unitWidth = getTimescaleUnitWidth(scale);
    if (scale === 'week') {
      const weekCellWidth = unitWidth;
      const weekIndex = Math.floor(x / weekCellWidth);
      const weekCellLeft = weekIndex * weekCellWidth;
      const slotWidth = weekCellWidth / 7;
      const dayOfWeek = Math.floor((x - weekCellLeft) / slotWidth);
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        return;
      }
      dayIndex = weekIndex * 7 + dayOfWeek;
    } else if (scale === 'month') {
      const monthCellWidth = unitWidth;
      const monthIndex = Math.floor(x / monthCellWidth);
      const monthCellLeft = monthIndex * monthCellWidth;
      const rangeStart = this.dateRange().start;
      const refDate = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + monthIndex, 1);
      const totalDaysInMonth = daysInMonth(refDate);
      const slotWidth = monthCellWidth / totalDaysInMonth;
      const dayOfMonth = Math.floor((x - monthCellLeft) / slotWidth);
      if (dayOfMonth < 0 || dayOfMonth >= totalDaysInMonth) {
        return;
      }
      dayIndex = 0;
      for (let i = 0; i < monthIndex; i++) {
        const d = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + i + 1, 0).getDate();
        dayIndex += d;
      }
      dayIndex += dayOfMonth;
    } else {
      const idx = Math.floor(x / unitWidth);
      if (idx < 0) {
        return;
      }
      dayIndex = idx;
    }
    const rangeStart = this.dateRange().start;
    const clickedDate = addDays(rangeStart, dayIndex);
    // Only allow today or future
    const today = startOfDay(new Date());
    if (clickedDate < today) return;
    // only create if no order occupies this day
    const isOccupied = this.visibleOrders().some((order) => {
      const start = isoToLocalDate(order.data.startDate);
      const end = isoToLocalDate(order.data.endDate);
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
          startDate: dateToIso(clickedDate),
          endDate: dateToIso(addDays(clickedDate, 7)),
        },
      },
      currentWorkOrders: this.workOrders(),
    });
  }

  onMouseMove(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const scale = this.timescale();
    let dayIndex = null;
    const unitWidth = getTimescaleUnitWidth(scale);
    if (scale === 'week') {
      // Find which week cell
      const weekCellWidth = unitWidth;
      const weekIndex = Math.floor(x / weekCellWidth);
      const weekCellLeft = weekIndex * weekCellWidth;
      const slotWidth = weekCellWidth / 7;
      const dayOfWeek = Math.floor((x - weekCellLeft) / slotWidth);
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        this.hoveredDayIndex.set(null);
        return;
      }
      // Calculate global day index from visible range start
      dayIndex = weekIndex * 7 + dayOfWeek;
    } else if (scale === 'month') {
      // Find which month cell
      const monthCellWidth = unitWidth;
      const monthIndex = Math.floor(x / monthCellWidth);
      const monthCellLeft = monthIndex * monthCellWidth;
      const rangeStart = this.dateRange().start;
      // Get days in this month
      const refDate = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + monthIndex, 1);
      const totalDaysInMonth = daysInMonth(refDate);
      const slotWidth = monthCellWidth / totalDaysInMonth;
      const dayOfMonth = Math.floor((x - monthCellLeft) / slotWidth);
      if (dayOfMonth < 0 || dayOfMonth >= totalDaysInMonth) {
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
      const idx = Math.floor(x / unitWidth);
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
