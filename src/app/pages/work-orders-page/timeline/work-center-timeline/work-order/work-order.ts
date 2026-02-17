import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StatusBadge } from '../../../components/status-badge/status-badge';
import { WorkOrderDocument } from '../../../../../core/models/work-order.model';

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
