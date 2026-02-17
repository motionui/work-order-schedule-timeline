import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
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
  private workOrderStore = inject(WorkOrderStore);
  private workOrderDrawerService = inject(WorkOrderDrawerService);

  formData = input<WorkOrderFormData | null>();

  protected formGroup: FormGroup;
  protected statusOptions = WORK_ORDER_STATUS_OPTIONS;

  constructor() {
    this.formGroup = new FormGroup(
      {
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
      },
      {
        validators: this.dateRangeValidator,
      },
    );

    effect(() => {
      const data = this.formData();
      if (!data) {
        return;
      }

      const workOrder = data.workOrder;
      this.formGroup.patchValue({
        name: workOrder.data.name,
        status: workOrder.data.status,
        startDate: this.toDateStruct(workOrder.data.startDate),
        endDate: this.toDateStruct(workOrder.data.endDate),
      });

      this.formGroup.updateValueAndValidity();
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

  /**
   * Properly typed Angular ValidatorFn
   */
  private dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const start = group.get('startDate')?.value as NgbDateStruct | null;
    const end = group.get('endDate')?.value as NgbDateStruct | null;

    if (!start || !end) {
      return null;
    }

    const startDate = new Date(start.year, start.month - 1, start.day);
    const endDate = new Date(end.year, end.month - 1, end.day);

    // end date cannot be before start date
    if (endDate < startDate) {
      return { endBeforeStart: true };
    }

    const data = this.formData();
    if (!data) {
      return null;
    }

    const currentId = data.workOrder?.docId;

    // overlap validation
    const hasOverlap = data.currentWorkOrders.some((order) => {
      if (order.docId === currentId) return false;

      const orderStart = this.toLocalDate(order.data.startDate);
      const orderEnd = this.toLocalDate(order.data.endDate);

      return startDate <= orderEnd && endDate >= orderStart;
    });

    if (hasOverlap) {
      return { overlappingRange: true };
    }

    return null;
  };

  private toLocalDate(iso: string): Date {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private toDateStruct(iso: string | null): NgbDateStruct | null {
    if (!iso) return null;
    const [year, month, day] = iso.split('-').map(Number);
    return { year, month, day };
  }

  private toIso(date: NgbDateStruct | null): string {
    if (!date) return '';
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
    if (!data) return;

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
