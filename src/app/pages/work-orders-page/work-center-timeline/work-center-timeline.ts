import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WorkOrderDocument } from '../../../core/models/work-order.model';
import { WorkCenterDocument } from '../../../core/models/work-center.model';

@Component({
  selector: 'app-work-center-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-center-timeline.html',
  styleUrl: './work-center-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkCenterTimeline {
  workCenter = input<WorkCenterDocument>();
  workOrders = input<WorkOrderDocument[]>();
}
