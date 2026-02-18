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
  workOrder = input<WorkOrderDocument>();

  edit = output<WorkOrderDocument>();
  delete = output<WorkOrderDocument>();

  tooltipText = computed(() => {
    const wo = this.workOrder();
    if (!wo?.data) {
      return '';
    }
    return `${wo.data.name} (${wo.data.status}) ${this.isoToDisplay(wo.data.startDate)} – ${this.isoToDisplay(wo.data.endDate)}`;
  });

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
