import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { WORK_ORDER_STATUS, WorkOrderStatus } from '../../../../core/models/work-order.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
  status = input<WorkOrderStatus>('open');

  statusLabel = computed(() => WORK_ORDER_STATUS[this.status()]);
}
