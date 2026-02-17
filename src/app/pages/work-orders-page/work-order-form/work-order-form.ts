import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { WORK_ORDER_STATUS_OPTIONS, WorkOrderDocument, WorkOrderStatus } from '../../../core/models/work-order.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatusBadge } from '../status-badge/status-badge';
import { NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DataPickerDateFormatService } from '../../../core/services/data-picker-date-format.service';

// ui model for passing data into the form
export interface WorkOrderFormData {
  mode: 'create' | 'edit';
  workOrder: WorkOrderDocument;
  currentWorkOrders: WorkOrderDocument[];
}

@Component({
  selector: 'app-work-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, StatusBadge, NgbDatepickerModule],
  providers: [{ provide: NgbDateParserFormatter, useClass: DataPickerDateFormatService }],
  templateUrl: './work-order-form.html',
  styleUrl: './work-order-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderForm {
  formData = input<WorkOrderFormData | null>();

  protected statusOptions = WORK_ORDER_STATUS_OPTIONS;

  protected formGroup: FormGroup = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<WorkOrderStatus>('open', { nonNullable: true }),
    startDate: new FormControl<string>('', { nonNullable: true }),
    endDate: new FormControl<string>('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const workOrderData = this.formData()?.workOrder;
      if (workOrderData) {
        this.formGroup.patchValue({
          name: workOrderData.data.name,
          status: workOrderData.data.status,
          startDate: workOrderData.data.startDate,
          endDate: workOrderData.data.endDate,
        });
      }
    });
  }

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
