import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { StatusBadge } from '../../components/status-badge/status-badge';
import { DataPickerDateFormatService } from '../../../../core/services/data-picker-date-format.service';
import { WORK_ORDER_STATUS_OPTIONS, WorkOrderDocument, WorkOrderStatus } from '../../../../core/models/work-order.model';
import { WorkOrderDrawerService } from '../../../../core/services/work-order-drawer.service';
import { WorkOrderStore } from '../../../../core/services/work-order.store';

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
  private workOrderDrawerService = inject(WorkOrderDrawerService);
  private workOrderStore = inject(WorkOrderStore);

  formData = input<WorkOrderFormData | null>();

  protected statusOptions = WORK_ORDER_STATUS_OPTIONS;

  protected formGroup = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<WorkOrderStatus>('open', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    startDate: new FormControl<NgbDateStruct | null>(null, {
      validators: [Validators.required],
    }),
    endDate: new FormControl<NgbDateStruct | null>(null, {
      validators: [Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      const data = this.formData();
      if (!data) return;

      const workOrder = data.workOrder;

      this.formGroup.patchValue({
        name: workOrder.data.name,
        status: workOrder.data.status,
        startDate: this.toDateStruct(workOrder.data.startDate),
        endDate: this.toDateStruct(workOrder.data.endDate),
      });
    });
  }

  private toDateStruct(iso: string | null): NgbDateStruct | null {
    if (!iso) {
      return null;
    }
    const [year, month, day] = iso.split('-').map(Number);
    return { year, month, day };
  }

  private toIso(date: NgbDateStruct | null): string {
    if (!date) {
      return '';
    }
    const mm = String(date.month).padStart(2, '0');
    const dd = String(date.day).padStart(2, '0');
    return `${date.year}-${mm}-${dd}`;
  }

  onClickCancel(): void {
    this.workOrderDrawerService.closeDrawer();
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const data = this.formData();
    if (!data) {
      return;
    }

    const formValue = this.formGroup.getRawValue();

    const payload: WorkOrderDocument = {
      ...data.workOrder,
      data: {
        ...data.workOrder.data,
        name: formValue.name,
        status: formValue.status,
        startDate: this.toIso(formValue.startDate),
        endDate: this.toIso(formValue.endDate),
      },
    };

    if (data.mode === 'create') {
      this.workOrderStore.add(payload);
    } else {
      this.workOrderStore.update(payload);
    }

    this.workOrderDrawerService.closeDrawer();
  }
}
