/**
 * Component for the work order form displayed in the drawer, with inputs for the work order data and a reactive form to edit the work order details, including validation for required fields, date range, and overlapping work orders
 */

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
  private workOrderStore = inject(WorkOrderStore);
  private workOrderDrawerService = inject(WorkOrderDrawerService);

  formData = input.required<WorkOrderFormData | null>();

  protected formGroup: FormGroup;
  protected statusOptions = WORK_ORDER_STATUS_OPTIONS;

  // Date bounds for datepickers (shared for start and end) as computed signals
  protected readonly minDate = computed(() => {
    const data = this.formData();
    if (!data) return this.getToday();
    const workOrder = data.workOrder;
    const workOrders = data.currentWorkOrders.filter(
      (wo) => wo.data.workCenterId === workOrder.data.workCenterId && wo.docId !== workOrder.docId,
    );
    workOrders.sort((a, b) => a.data.startDate.localeCompare(b.data.startDate));
    const clicked = this.toLocalDate(workOrder.data.startDate);
    let prevEnd: Date | null = null;
    for (const wo of workOrders) {
      const woEnd = this.toLocalDate(wo.data.endDate);
      if (woEnd < clicked && (!prevEnd || woEnd > prevEnd)) {
        prevEnd = woEnd;
      }
    }
    const min = prevEnd ? this.addDays(prevEnd, 1) : clicked;
    return this.toDateStructISO(min);
  });

  protected readonly maxDate = computed(() => {
    const data = this.formData();
    if (!data) return { year: 2100, month: 12, day: 31 };
    const workOrder = data.workOrder;
    const workOrders = data.currentWorkOrders.filter(
      (wo) => wo.data.workCenterId === workOrder.data.workCenterId && wo.docId !== workOrder.docId,
    );
    workOrders.sort((a, b) => a.data.startDate.localeCompare(b.data.startDate));
    const clicked = this.toLocalDate(workOrder.data.startDate);
    let nextStart: Date | null = null;
    for (const wo of workOrders) {
      const woStart = this.toLocalDate(wo.data.startDate);
      if (woStart > clicked && (!nextStart || woStart < nextStart)) {
        nextStart = woStart;
      }
    }
    const max = nextStart ? this.addDays(nextStart, -1) : clicked;
    return this.toDateStructISO(max);
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
        startDate: this.toDateStruct(workOrder.data.startDate),
        endDate: this.toDateStruct(workOrder.data.endDate),
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

  // Helper: get today's date as NgbDateStruct
  private getToday(): NgbDateStruct {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  }

  // Helper: add days to a date
  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  // Helper: convert Date to NgbDateStruct
  private toDateStructISO(date: Date): NgbDateStruct {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  private toLocalDate(iso: string): Date {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
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
