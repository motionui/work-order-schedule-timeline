import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  addDays,
  dateToNgbDateStruct,
  isoToLocalDate,
  isoToNgbDateStruct,
  ngbDateStructToDate,
  ngbDateStructToIso,
} from '../../../../core/common/date-helpers';
import { WORK_ORDER_STATUS_OPTIONS, WorkOrderDocument } from '../../../../core/models/work-order.model';
import { DataPickerDateFormatService } from '../../../../core/services/data-picker-date-format.service';
import { WorkOrderDrawerService } from '../../../../core/services/work-order-drawer.service';
import { WorkOrderStore } from '../../../../core/services/work-order.store';
import { StatusBadge } from '../../components/status-badge/status-badge';

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
  private static readonly DEFAULT_MAX_DATE: NgbDateStruct = { year: 2100, month: 12, day: 31 };

  private workOrderStore = inject(WorkOrderStore);
  private workOrderDrawerService = inject(WorkOrderDrawerService);

  formData = input.required<WorkOrderFormData | null>();

  protected formGroup: FormGroup;
  protected statusOptions = WORK_ORDER_STATUS_OPTIONS;

  // Date bounds for datepickers (shared for start and end) as computed signals
  protected readonly minDate = computed(() => {
    const data = this.formData();
    if (!data) return dateToNgbDateStruct(new Date());
    const workOrder = data.workOrder;
    const workOrders = data.currentWorkOrders.filter(
      (wo) => wo.data.workCenterId === workOrder.data.workCenterId && wo.docId !== workOrder.docId,
    );
    workOrders.sort((a, b) => a.data.startDate.localeCompare(b.data.startDate));
    const clicked = isoToLocalDate(workOrder.data.startDate);
    let prevEnd: Date | null = null;
    for (const wo of workOrders) {
      const woEnd = isoToLocalDate(wo.data.endDate);
      if (woEnd < clicked && (!prevEnd || woEnd > prevEnd)) {
        prevEnd = woEnd;
      }
    }
    const min = prevEnd ? addDays(prevEnd, 1) : clicked;
    return dateToNgbDateStruct(min);
  });

  protected readonly maxDate = computed(() => {
    const data = this.formData();
    if (!data) return WorkOrderForm.DEFAULT_MAX_DATE;
    const workOrder = data.workOrder;
    const workOrders = data.currentWorkOrders.filter(
      (wo) => wo.data.workCenterId === workOrder.data.workCenterId && wo.docId !== workOrder.docId,
    );
    workOrders.sort((a, b) => a.data.startDate.localeCompare(b.data.startDate));
    const clicked = isoToLocalDate(workOrder.data.startDate);
    let nextStart: Date | null = null;
    for (const wo of workOrders) {
      const woStart = isoToLocalDate(wo.data.startDate);
      if (woStart > clicked && (!nextStart || woStart < nextStart)) {
        nextStart = woStart;
      }
    }
    const max = nextStart ? addDays(nextStart, -1) : null;
    if (!max) {
      return WorkOrderForm.DEFAULT_MAX_DATE;
    }
    return dateToNgbDateStruct(max);
  });

  constructor() {
    this.formGroup = new FormGroup(
      {
        name: new FormControl<string>('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z0-9\s\-]+$/),
          ],
        }),
        status: new FormControl('open', {
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

    // Auto-populate form fields when formData changes
    effect(() => {
      const data = this.formData();
      if (!data) return;
      const workOrder = data.workOrder;
      this.formGroup.patchValue({
        name: workOrder.data.name,
        status: workOrder.data.status,
        startDate: isoToNgbDateStruct(workOrder.data.startDate),
        endDate: isoToNgbDateStruct(workOrder.data.endDate),
      });
      this.formGroup.updateValueAndValidity();
    });
  }

  // Getters for easy access to form controls in the template
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

  // Method to generate user-friendly error messages for the name field based on the validation errors present
  protected nameErrorMessage(): string | null {
    if (!this.name.errors) {
      return null;
    }

    if (this.name.errors['required']) {
      return 'Work order name is required.';
    }

    if (this.name.errors['minlength']) {
      return 'Work order name must be at least 5 characters long.';
    }

    if (this.name.errors['maxlength']) {
      return 'Work order name cannot exceed 50 characters.';
    }

    if (this.name.errors['pattern']) {
      return 'Work order name contains invalid characters.';
    }

    return null;
  }

  // Custom validator to check that the end date is not before the start date and that the selected date range does not overlap with existing work orders
  private dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const start = group.get('startDate')?.value as NgbDateStruct | null;
    const end = group.get('endDate')?.value as NgbDateStruct | null;

    if (!start || !end) {
      return null;
    }

    const startDate = ngbDateStructToDate(start);
    const endDate = ngbDateStructToDate(end);

    // end date cannot be before start date
    if (endDate < startDate) {
      return { endBeforeStart: true };
    }

    const data = this.formData();
    if (!data) {
      return null;
    }

    const currentId = data.workOrder?.docId;
    const currentWorkCenterId = data.workOrder?.data.workCenterId;

    // overlap validation
    const hasOverlap = data.currentWorkOrders.some((order) => {
      if (order.docId === currentId) return false;
      if (order.data.workCenterId !== currentWorkCenterId) return false;

      const orderStart = isoToLocalDate(order.data.startDate);
      const orderEnd = isoToLocalDate(order.data.endDate);

      return startDate <= orderEnd && endDate >= orderStart;
    });

    if (hasOverlap) {
      return { overlappingRange: true };
    }

    return null;
  };

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
        startDate: ngbDateStructToIso(formValue.startDate),
        endDate: ngbDateStructToIso(formValue.endDate),
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
