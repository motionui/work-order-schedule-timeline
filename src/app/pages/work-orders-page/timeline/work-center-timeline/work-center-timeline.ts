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
const MONTH_LEFT_PADDING = 4;
const MONTH_RIGHT_PADDING = 4;
const MONTH_GAP = 2;
const GUTTER_WIDTH_PX = 8;

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

  hoverPreview = computed(() => {
    const index = this.hoveredDayIndex();
    if (index === null) return null;

    const scale = this.timescale();
    const rangeStart = this.dateRange().start;
    let clickedDate: Date;
    let left = 0;
    let width = 0;

    if (scale === 'week') {
      clickedDate = addDays(rangeStart, index);
      const weekIndex = Math.floor(index / 7);
      const dayOfWeek = index % 7;
      const weekCellLeft = weekIndex * getTimescaleUnitWidth(scale) + GUTTER_WIDTH_PX / 2;
      const weekCellWidth = getTimescaleUnitWidth(scale) - GUTTER_WIDTH_PX;
      const slotWidth = weekCellWidth / 7;

      /**
       * @upgrade Investigate why we need to add hacky 6px and 11px to align the hover preview
       */
      left = weekCellLeft + slotWidth * dayOfWeek + 6;
      width = slotWidth - 11;
    } else if (scale === 'month') {
      clickedDate = addDays(rangeStart, index);
      const monthIndex =
        clickedDate.getFullYear() * 12 + clickedDate.getMonth() - (rangeStart.getFullYear() * 12 + rangeStart.getMonth());
      const monthCellLeft = monthIndex * getTimescaleUnitWidth(scale) + GUTTER_WIDTH_PX / 2;
      const monthCellWidth = getTimescaleUnitWidth(scale) - GUTTER_WIDTH_PX;
      const totalDaysInMonth = daysInMonth(clickedDate);
      const dayOfMonth = clickedDate.getDate() - 1;
      const slotWidth = monthCellWidth / totalDaysInMonth;
      // For hoverPreview, treat as single-day slot, match bar logic
      // Add 2px extra spacing to separate preview from today's line
      left = Math.round(monthCellLeft + slotWidth * dayOfMonth + MONTH_LEFT_PADDING + 6);
      width = Math.round(slotWidth - MONTH_LEFT_PADDING - MONTH_RIGHT_PADDING - 10);
    } else {
      // day
      clickedDate = addDays(rangeStart, index);
      left = index * getTimescaleUnitWidth(scale) + GUTTER_WIDTH_PX / 2 + 4;
      width = getTimescaleUnitWidth(scale) - GUTTER_WIDTH_PX - 8;
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
        const weekCellLeft = weekIndex * getTimescaleUnitWidth(scale) + GUTTER_WIDTH_PX / 2;
        const weekCellWidth = getTimescaleUnitWidth(scale) - GUTTER_WIDTH_PX;
        const slotWidth = weekCellWidth / 7;
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
        const monthCellLeft = monthIndex * getTimescaleUnitWidth(scale) + GUTTER_WIDTH_PX / 2;
        const monthCellWidth = getTimescaleUnitWidth(scale) - GUTTER_WIDTH_PX;
        // Number of days in this month
        const totalDaysInMonth = daysInMonth(monthStart);
        const slotWidth = monthCellWidth / totalDaysInMonth;
        for (const order of orders) {
          const orderStart = isoToLocalDate(order.data.startDate);
          const orderEnd = isoToLocalDate(order.data.endDate);
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
      const orderStart = isoToLocalDate(order.data.startDate);
      const orderEnd = isoToLocalDate(order.data.endDate);

      let clampedStart = orderStart < range.start ? range.start : orderStart;
      let clampedEnd = orderEnd > range.end ? range.end : orderEnd;

      let left = 0;
      let width = 0;

      left = daysBetween(range.start, clampedStart) * getTimescaleUnitWidth(this.timescale()) + GUTTER_WIDTH_PX / 2;
      width = (daysBetween(clampedStart, clampedEnd) + 1) * getTimescaleUnitWidth(this.timescale()) - GUTTER_WIDTH_PX - 1;

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
      const totalDaysInMonth = daysInMonth(refDate);
      const slotWidth = (monthCellWidth - GUTTER_WIDTH_PX) / totalDaysInMonth;
      const dayOfMonth = Math.floor((x - monthCellLeft - GUTTER_WIDTH_PX / 2) / slotWidth);
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
      const adjustedX = x - GUTTER_WIDTH_PX / 2;
      const idx = Math.floor(adjustedX / getTimescaleUnitWidth(scale));
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
      const totalDaysInMonth = daysInMonth(refDate);
      const slotWidth = (monthCellWidth - GUTTER_WIDTH_PX) / totalDaysInMonth;
      const dayOfMonth = Math.floor((x - monthCellLeft - GUTTER_WIDTH_PX / 2) / slotWidth);
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
