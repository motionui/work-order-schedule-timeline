import { computed, signal, WritableSignal } from '@angular/core';

import { finalize, Observable, tap } from 'rxjs';
import { WorkCenterDocument } from '../models/work-center.model';
import { WorkOrderDocument } from '../models/work-order.model';

export abstract class WorkOrdersRepository {
  // ==========================================
  // Internal writable state
  // ==========================================
  private readonly workCentersState: WritableSignal<WorkCenterDocument[]> = signal([]);
  private readonly workOrdersState: WritableSignal<WorkOrderDocument[]> = signal([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<unknown | null>(null);

  // ==========================================
  // Public readonly signals
  // ==========================================
  readonly workCenters = this.workCentersState.asReadonly();
  readonly workOrders = this.workOrdersState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Example derived state
  readonly workOrderCount = computed(() => this.workOrdersState().length);

  // ==========================================
  // Load operations (populate state)
  // ==========================================
  loadWorkCenters(): Observable<WorkCenterDocument[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    return this.fetchWorkCenters().pipe(
      tap({
        next: (data) => this.workCentersState.set(data),
        error: (err) => this.errorState.set(err),
      }),
      finalize(() => this.loadingState.set(false)),
    );
  }

  loadWorkOrders(): Observable<WorkOrderDocument[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    return this.fetchWorkOrders().pipe(
      tap({
        next: (data) => this.workOrdersState.set(data),
        error: (err) => this.errorState.set(err),
      }),
      finalize(() => this.loadingState.set(false)),
    );
  }

  // ==========================================
  // CRUD operations (update state centrally)
  // ==========================================
  addWorkOrder(workOrder: WorkOrderDocument): Observable<WorkOrderDocument> {
    return this.persistAdd(workOrder).pipe(
      tap((created) => {
        this.workOrdersState.update((list) => [...list, created]);
      }),
    );
  }

  updateWorkOrder(workOrder: WorkOrderDocument): Observable<WorkOrderDocument> {
    return this.persistUpdate(workOrder).pipe(
      tap((updated) => {
        this.workOrdersState.update((list) => list.map((wo) => (wo.docId === updated.docId ? updated : wo)));
      }),
    );
  }

  deleteWorkOrder(workOrder: WorkOrderDocument): Observable<void> {
    return this.persistDelete(workOrder).pipe(
      tap(() => {
        this.workOrdersState.update((list) => list.filter((wo) => wo.docId !== workOrder.docId));
      }),
    );
  }

  // ==========================================
  // Transport layer (implemented by subclass)
  // ==========================================
  protected abstract fetchWorkCenters(): Observable<WorkCenterDocument[]>;
  protected abstract fetchWorkOrders(): Observable<WorkOrderDocument[]>;

  protected abstract persistAdd(workOrder: WorkOrderDocument): Observable<WorkOrderDocument>;

  protected abstract persistUpdate(workOrder: WorkOrderDocument): Observable<WorkOrderDocument>;

  protected abstract persistDelete(workOrder: WorkOrderDocument): Observable<void>;
}
