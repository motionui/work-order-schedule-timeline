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
  workCenter = input<WorkCenterDocument>();
}
