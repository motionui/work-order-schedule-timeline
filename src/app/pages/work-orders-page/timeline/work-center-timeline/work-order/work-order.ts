/**
 * Component to display a work order in the timeline, with a tooltip showing the work order details and buttons to edit or delete the work order
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkOrderDocument } from '../../../../../core/models/work-order.model';
import { StatusBadge } from '../../../components/status-badge/status-badge';

@Component({
  selector: 'app-work-order',
  standalone: true,
  imports: [CommonModule, StatusBadge, NgbDropdownModule, NgbTooltipModule],
  templateUrl: './work-order.html',
  styleUrl: './work-order.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrder {
  workOrder = input.required<WorkOrderDocument>();

  edit = output<WorkOrderDocument>();
  delete = output<WorkOrderDocument>();

  tooltipText = computed(() => {
    const wo = this.workOrder();
    if (!wo?.data) {
      return '';
    }
    return `${wo.data.name} (${wo.data.status}) ${this.isoToDisplay(wo.data.startDate)} – ${this.isoToDisplay(wo.data.endDate)}`;
  });

  // @upgrade Create seperate helper file for date formatting utilities
  isoToDisplay(iso: string): string {
    const [year, month, day] = iso.split('-');
    return `${month}.${day}.${year}`;
  }

  onClickEdit() {
    const workOrder = this.workOrder();
    if (workOrder) {
      this.edit.emit(workOrder);
    }
  }

  onClickDelete() {
    const workOrder = this.workOrder();
    if (workOrder) {
      this.delete.emit(workOrder);
    }
  }
}
