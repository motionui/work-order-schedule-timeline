/**
 * Service to manage the state of work centers and work orders, providing methods to add, update, delete, and load sample data
 */

import { Injectable, signal } from '@angular/core';

import { WorkCenterDocument } from '../models/work-center.model';
import { WorkOrderDocument } from '../models/work-order.model';
import { SAMPLE_WORK_CENTERS, SAMPLE_WORK_ORDERS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class WorkOrderStore {
  private workCenters = signal<WorkCenterDocument[]>([]);
  private workOrders = signal<WorkOrderDocument[]>([]);

  // expose readonly signals
  workCenters$ = this.workCenters.asReadonly();
  workOrders$ = this.workOrders.asReadonly();

  // CRUD operations for work orders
  // There is no requirement to add, update, or delete work centers in the current application scope, so only work orders have these methods implemented
  add(newWorkOrders: WorkOrderDocument): void {
    this.workOrders.update((workOrders) => [...workOrders, newWorkOrders]);
  }

  update(updatedWorkOrder: WorkOrderDocument): void {
    this.workOrders.update((workOrders) =>
      workOrders.map((workOrder) =>
        workOrder.docId === updatedWorkOrder.docId && workOrder.data.workCenterId === updatedWorkOrder.data.workCenterId
          ? updatedWorkOrder
          : workOrder,
      ),
    );

    console.log(JSON.stringify(this.workOrders()));
  }

  delete(workOrder: WorkOrderDocument): void {
    this.workOrders.update((workOrders) => workOrders.filter((item) => item.docId !== workOrder.docId));
  }

  loadSampleData(): void {
    this.workCenters.set(SAMPLE_WORK_CENTERS);
    this.workOrders.set(SAMPLE_WORK_ORDERS);
  }
}
