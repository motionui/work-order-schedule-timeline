import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { WORK_ORDER_STATUS_OPTIONS, WorkOrderStatus } from '../../../core/models/work-order.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatusBadge } from '../status-badge/status-badge';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-work-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, StatusBadge, NgbDatepickerModule],
  templateUrl: './work-order-form.html',
  styleUrl: './work-order-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderForm {
  workOrderStatus: WorkOrderStatus = 'open';

  protected statusOptions = WORK_ORDER_STATUS_OPTIONS;

  formGroup: FormGroup = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<WorkOrderStatus>('open', { nonNullable: true }),
    startDate: new FormControl<string>('', { nonNullable: true }),
    endDate: new FormControl<string>('', { nonNullable: true }),
  });

  get name(): FormControl {
    return this.formGroup.get('name') as FormControl;
  }

  get status(): FormControl {
    return this.formGroup.get('status') as FormControl;
  }

  get startDate(): FormControl {
    return this.formGroup.get('startDate') as FormControl;
  }

  get endDate(): FormControl {
    return this.formGroup.get('endDate') as FormControl;
  }
}
// Use a mode flag: `'create' | 'edit'`
