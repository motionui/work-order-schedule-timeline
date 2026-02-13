import { Injectable, signal } from '@angular/core';
import { WorkCenterDocument } from '../models/work-center.model';
import { WorkOrderDocument } from '../models/work-order.model';

const SAMPLE_WORK_CENTERS: WorkCenterDocument[] = [
  {
    docId: 'WORKCENTER-00',
    docType: 'workCenter',
    data: {
      name: 'Extrusion Line A',
    },
  },
  {
    docId: 'WORKCENTER-01',
    docType: 'workCenter',
    data: {
      name: 'CNC Machine 1',
    },
  },
  {
    docId: 'WORKCENTER-02',
    docType: 'workCenter',
    data: {
      name: 'Assembly Station',
    },
  },
  {
    docId: 'WORKCENTER-03',
    docType: 'workCenter',
    data: {
      name: 'Quality Control',
    },
  },
  {
    docId: 'WORKCENTER-04',
    docType: 'workCenter',
    data: {
      name: 'Packaging Line',
    },
  },
  {
    docId: 'WORKCENTER-05',
    docType: 'workCenter',
    data: {
      name: 'Shipping Line',
    },
  },
  {
    docId: 'WORKCENTER-06',
    docType: 'workCenter',
    data: {
      name: 'Return Line',
    },
  },
];

const SAMPLE_WORK_ORDERS: WorkOrderDocument[] = [
  {
    docId: 'WORKORDER-01-00',
    docType: 'workOrder',
    data: {
      name: '',
      workCenterId: 'WORKCENTER-01',
      status: 'open',
      startDate: '2025-01-15',
      endDate: '',
    },
  },
  {
    docId: 'WORKORDER-01-01',
    docType: 'workOrder',
    data: {
      name: '',
      workCenterId: 'WORKCENTER-01',
      status: 'open',
      startDate: '2025-01-17',
      endDate: '',
    },
  },
  {
    docId: 'WORKORDER-01-02',
    docType: 'workOrder',
    data: {
      name: '',
      workCenterId: 'WORKCENTER-01',
      status: 'open',
      startDate: '2025-01-20',
      endDate: '',
    },
  },
  {
    docId: 'WORKORDER-01-03',
    docType: 'workOrder',
    data: {
      name: '',
      workCenterId: 'WORKCENTER-01',
      status: 'open',
      startDate: '2025-01-23',
      endDate: '',
    },
  },
  {
    docId: 'WORKORDER-01-04',
    docType: 'workOrder',
    data: {
      name: '',
      workCenterId: 'WORKCENTER-01',
      status: 'open',
      startDate: '2025-01-25',
      endDate: '',
    },
  },
  {
    docId: 'WORKORDER-01-05',
    docType: 'workOrder',
    data: {
      name: '',
      workCenterId: 'WORKCENTER-01',
      status: 'open',
      startDate: '2025-01-28',
      endDate: '',
    },
  },
  {
    docId: 'WORKORDER-01-06',
    docType: 'workOrder',
    data: {
      name: '',
      workCenterId: 'WORKCENTER-01',
      status: 'open',
      startDate: '2025-01-30',
      endDate: '',
    },
  },
  {
    docId: 'WORKORDER-01-07',
    docType: 'workOrder',
    data: {
      name: '',
      workCenterId: 'WORKCENTER-01',
      status: 'open',
      startDate: '2025-02-02',
      endDate: '',
    },
  },
];

@Injectable({ providedIn: 'root' })
export class WorkOrderStore {
  private workCenters = signal<WorkCenterDocument[]>([]);
  private workOrders = signal<WorkOrderDocument[]>([]);

  // expose readonly signals
  workCenters$ = this.workCenters.asReadonly();
  workOrders$ = this.workOrders.asReadonly();

  // ---- CRUD ----
  add(newWorkOrders: WorkOrderDocument): void {
    this.workOrders.update((workOrders) => [...workOrders, newWorkOrders]);
  }

  update(updatedWorkOrder: WorkOrderDocument): void {
    this.workOrders.update((workOrders) =>
      workOrders.map((workOrder) => (workOrder.docId === updatedWorkOrder.docId ? updatedWorkOrder : workOrder)),
    );
  }

  delete(docId: string): void {
    this.workOrders.update((workOrders) => workOrders.filter((workOrder) => workOrder.docId !== docId));
  }

  loadSampleData(): void {
    this.workCenters.set(SAMPLE_WORK_CENTERS);
    this.workOrders.set(SAMPLE_WORK_ORDERS);
  }
}
