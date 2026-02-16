import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WorkCenterDocument } from '../../../core/models/work-center.model';
import { WorkOrderDocument } from '../../../core/models/work-order.model';
import { StatusBadge } from '../status-badge/status-badge';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-work-order',
  standalone: true,
  imports: [CommonModule, StatusBadge, NgbDropdownModule],
  templateUrl: './work-order.html',
  styleUrl: './work-order.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrder {
  workCenter = input<WorkCenterDocument>();
  workOrder = input<WorkOrderDocument>();

  edit = output<WorkOrderDocument>();
  delete = output<WorkOrderDocument>();

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
