import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WorkCenterDocument } from '../../../core/models/work-center.model';

@Component({
  selector: 'app-work-center-column',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-center-column.html',
  styleUrl: './work-center-column.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkCenterColumn {
  workCenters = input<WorkCenterDocument[]>();
}
