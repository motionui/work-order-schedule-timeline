/**
 * Component to display a work center in the timeline, with the work center name displayed and the work orders for that center shown in the timeline below
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { WorkCenterDocument } from '../../../../core/models/work-center.model';

@Component({
  selector: 'app-work-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-center.html',
  styleUrl: './work-center.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkCenter {
  workCenter = input.required<WorkCenterDocument>();
}
