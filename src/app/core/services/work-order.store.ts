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
      name: 'Work order 01',
      workCenterId: 'WORKCENTER-00',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-04',
    },
  },
  {
    docId: 'WORKORDER-01-01',
    docType: 'workOrder',
    data: {
      name: 'Work order 02',
      workCenterId: 'WORKCENTER-00',
      status: 'in-progress',
      startDate: '2026-02-05',
      endDate: '2026-02-06',
    },
  },
  {
    docId: 'WORKORDER-01-02',
    docType: 'workOrder',
    data: {
      name: 'Work order 03',
      workCenterId: 'WORKCENTER-00',
      status: 'complete',
      startDate: '2026-02-07',
      endDate: '2026-02-08',
    },
  },
  {
    docId: 'WORKORDER-01-03',
    docType: 'workOrder',
    data: {
      name: 'Work order 04',
      workCenterId: 'WORKCENTER-00',
      status: 'blocked',
      startDate: '2026-02-09',
      endDate: '2026-02-10',
    },
  },
  {
    docId: 'WORKORDER-01-04',
    docType: 'workOrder',
    data: {
      name: 'Work order 05',
      workCenterId: 'WORKCENTER-00',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-02-17',
    },
  },
  {
    docId: 'WORKORDER-01-05',
    docType: 'workOrder',
    data: {
      name: 'Work order 06',
      workCenterId: 'WORKCENTER-00',
      status: 'in-progress',
      startDate: '2026-02-19',
      endDate: '2026-02-20',
    },
  },
  {
    docId: 'WORKORDER-01-06',
    docType: 'workOrder',
    data: {
      name: 'Work order 07',
      workCenterId: 'WORKCENTER-00',
      status: 'in-progress',
      startDate: '2026-02-21',
      endDate: '2026-02-22',
    },
  },
  {
    docId: 'WORKORDER-01-07',
    docType: 'workOrder',
    data: {
      name: 'Work order 08',
      workCenterId: 'WORKCENTER-00',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-02-25',
    },
  },
  {
    docId: 'WORKORDER-01-00',
    docType: 'workOrder',
    data: {
      name: 'Work order 01',
      workCenterId: 'WORKCENTER-01',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-04',
    },
  },
  {
    docId: 'WORKORDER-01-01',
    docType: 'workOrder',
    data: {
      name: 'Work order 02',
      workCenterId: 'WORKCENTER-01',
      status: 'in-progress',
      startDate: '2026-02-05',
      endDate: '2026-02-06',
    },
  },
  {
    docId: 'WORKORDER-01-02',
    docType: 'workOrder',
    data: {
      name: 'Work order 03',
      workCenterId: 'WORKCENTER-01',
      status: 'complete',
      startDate: '2026-02-07',
      endDate: '2026-02-08',
    },
  },
  {
    docId: 'WORKORDER-01-03',
    docType: 'workOrder',
    data: {
      name: 'Work order 04',
      workCenterId: 'WORKCENTER-01',
      status: 'blocked',
      startDate: '2026-02-09',
      endDate: '2026-02-10',
    },
  },
  {
    docId: 'WORKORDER-01-04',
    docType: 'workOrder',
    data: {
      name: 'Work order 05',
      workCenterId: 'WORKCENTER-01',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-02-17',
    },
  },
  {
    docId: 'WORKORDER-01-05',
    docType: 'workOrder',
    data: {
      name: 'Work order 06',
      workCenterId: 'WORKCENTER-01',
      status: 'in-progress',
      startDate: '2026-02-19',
      endDate: '2026-02-20',
    },
  },
  {
    docId: 'WORKORDER-01-06',
    docType: 'workOrder',
    data: {
      name: 'Work order 07',
      workCenterId: 'WORKCENTER-01',
      status: 'in-progress',
      startDate: '2026-02-21',
      endDate: '2026-02-22',
    },
  },
  {
    docId: 'WORKORDER-01-07',
    docType: 'workOrder',
    data: {
      name: 'Work order 08',
      workCenterId: 'WORKCENTER-01',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-02-25',
    },
  },
  {
    docId: 'WORKORDER-01-00',
    docType: 'workOrder',
    data: {
      name: 'Work order 02',
      workCenterId: 'WORKCENTER-02',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-04',
    },
  },
  {
    docId: 'WORKORDER-01-01',
    docType: 'workOrder',
    data: {
      name: 'Work order 02',
      workCenterId: 'WORKCENTER-02',
      status: 'in-progress',
      startDate: '2026-02-05',
      endDate: '2026-02-06',
    },
  },
  {
    docId: 'WORKORDER-01-02',
    docType: 'workOrder',
    data: {
      name: 'Work order 03',
      workCenterId: 'WORKCENTER-02',
      status: 'complete',
      startDate: '2026-02-07',
      endDate: '2026-02-08',
    },
  },
  {
    docId: 'WORKORDER-01-03',
    docType: 'workOrder',
    data: {
      name: 'Work order 04',
      workCenterId: 'WORKCENTER-02',
      status: 'blocked',
      startDate: '2026-02-09',
      endDate: '2026-02-10',
    },
  },
  {
    docId: 'WORKORDER-01-04',
    docType: 'workOrder',
    data: {
      name: 'Work order 05',
      workCenterId: 'WORKCENTER-02',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-02-17',
    },
  },
  {
    docId: 'WORKORDER-01-05',
    docType: 'workOrder',
    data: {
      name: 'Work order 06',
      workCenterId: 'WORKCENTER-02',
      status: 'in-progress',
      startDate: '2026-02-19',
      endDate: '2026-02-20',
    },
  },
  {
    docId: 'WORKORDER-01-06',
    docType: 'workOrder',
    data: {
      name: 'Work order 07',
      workCenterId: 'WORKCENTER-02',
      status: 'in-progress',
      startDate: '2026-02-21',
      endDate: '2026-02-22',
    },
  },
  {
    docId: 'WORKORDER-01-07',
    docType: 'workOrder',
    data: {
      name: 'Work order 08',
      workCenterId: 'WORKCENTER-02',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-02-25',
    },
  },
  {
    docId: 'WORKORDER-01-00',
    docType: 'workOrder',
    data: {
      name: 'Work order 02',
      workCenterId: 'WORKCENTER-03',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-04',
    },
  },
  {
    docId: 'WORKORDER-01-01',
    docType: 'workOrder',
    data: {
      name: 'Work order 02',
      workCenterId: 'WORKCENTER-03',
      status: 'in-progress',
      startDate: '2026-02-05',
      endDate: '2026-02-06',
    },
  },
  {
    docId: 'WORKORDER-01-02',
    docType: 'workOrder',
    data: {
      name: 'Work order 03',
      workCenterId: 'WORKCENTER-03',
      status: 'complete',
      startDate: '2026-02-07',
      endDate: '2026-02-08',
    },
  },
  {
    docId: 'WORKORDER-01-03',
    docType: 'workOrder',
    data: {
      name: 'Work order 04',
      workCenterId: 'WORKCENTER-03',
      status: 'blocked',
      startDate: '2026-02-09',
      endDate: '2026-02-10',
    },
  },
  {
    docId: 'WORKORDER-01-04',
    docType: 'workOrder',
    data: {
      name: 'Work order 05',
      workCenterId: 'WORKCENTER-03',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-02-17',
    },
  },
  {
    docId: 'WORKORDER-01-05',
    docType: 'workOrder',
    data: {
      name: 'Work order 06',
      workCenterId: 'WORKCENTER-03',
      status: 'in-progress',
      startDate: '2026-02-19',
      endDate: '2026-02-20',
    },
  },
  {
    docId: 'WORKORDER-01-06',
    docType: 'workOrder',
    data: {
      name: 'Work order 07',
      workCenterId: 'WORKCENTER-03',
      status: 'in-progress',
      startDate: '2026-02-21',
      endDate: '2026-02-22',
    },
  },
  {
    docId: 'WORKORDER-01-07',
    docType: 'workOrder',
    data: {
      name: 'Work order 08',
      workCenterId: 'WORKCENTER-03',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-02-25',
    },
  },
  {
    docId: 'WORKORDER-01-00',
    docType: 'workOrder',
    data: {
      name: 'Work order 02',
      workCenterId: 'WORKCENTER-04',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-04',
    },
  },
  {
    docId: 'WORKORDER-01-01',
    docType: 'workOrder',
    data: {
      name: 'Work order 02',
      workCenterId: 'WORKCENTER-04',
      status: 'in-progress',
      startDate: '2026-02-05',
      endDate: '2026-02-06',
    },
  },
  {
    docId: 'WORKORDER-01-02',
    docType: 'workOrder',
    data: {
      name: 'Work order 03',
      workCenterId: 'WORKCENTER-04',
      status: 'complete',
      startDate: '2026-02-07',
      endDate: '2026-02-08',
    },
  },
  {
    docId: 'WORKORDER-01-03',
    docType: 'workOrder',
    data: {
      name: 'Work order 04',
      workCenterId: 'WORKCENTER-04',
      status: 'blocked',
      startDate: '2026-02-09',
      endDate: '2026-02-10',
    },
  },
  {
    docId: 'WORKORDER-01-04',
    docType: 'workOrder',
    data: {
      name: 'Work order 05',
      workCenterId: 'WORKCENTER-04',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-02-17',
    },
  },
  {
    docId: 'WORKORDER-01-05',
    docType: 'workOrder',
    data: {
      name: 'Work order 06',
      workCenterId: 'WORKCENTER-04',
      status: 'in-progress',
      startDate: '2026-02-19',
      endDate: '2026-02-20',
    },
  },
  {
    docId: 'WORKORDER-01-06',
    docType: 'workOrder',
    data: {
      name: 'Work order 07',
      workCenterId: 'WORKCENTER-04',
      status: 'in-progress',
      startDate: '2026-02-21',
      endDate: '2026-02-22',
    },
  },
  {
    docId: 'WORKORDER-01-07',
    docType: 'workOrder',
    data: {
      name: 'Work order 08',
      workCenterId: 'WORKCENTER-04',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-02-25',
    },
  },
  {
    docId: 'WORKORDER-01-00',
    docType: 'workOrder',
    data: {
      name: 'Work order 02',
      workCenterId: 'WORKCENTER-05',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-04',
    },
  },
  {
    docId: 'WORKORDER-01-01',
    docType: 'workOrder',
    data: {
      name: 'Work order 02',
      workCenterId: 'WORKCENTER-05',
      status: 'in-progress',
      startDate: '2026-02-05',
      endDate: '2026-02-06',
    },
  },
  {
    docId: 'WORKORDER-01-02',
    docType: 'workOrder',
    data: {
      name: 'Work order 03',
      workCenterId: 'WORKCENTER-05',
      status: 'complete',
      startDate: '2026-02-07',
      endDate: '2026-02-08',
    },
  },
  {
    docId: 'WORKORDER-01-03',
    docType: 'workOrder',
    data: {
      name: 'Work order 04',
      workCenterId: 'WORKCENTER-05',
      status: 'blocked',
      startDate: '2026-02-09',
      endDate: '2026-02-10',
    },
  },
  {
    docId: 'WORKORDER-01-04',
    docType: 'workOrder',
    data: {
      name: 'Work order 05',
      workCenterId: 'WORKCENTER-05',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-02-17',
    },
  },
  {
    docId: 'WORKORDER-01-05',
    docType: 'workOrder',
    data: {
      name: 'Work order 06',
      workCenterId: 'WORKCENTER-05',
      status: 'in-progress',
      startDate: '2026-02-19',
      endDate: '2026-02-20',
    },
  },
  {
    docId: 'WORKORDER-01-06',
    docType: 'workOrder',
    data: {
      name: 'Work order 07',
      workCenterId: 'WORKCENTER-05',
      status: 'in-progress',
      startDate: '2026-02-21',
      endDate: '2026-02-22',
    },
  },
  {
    docId: 'WORKORDER-01-07',
    docType: 'workOrder',
    data: {
      name: 'Work order 08',
      workCenterId: 'WORKCENTER-05',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-02-25',
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
      workOrders.map((workOrder) =>
        workOrder.docId === updatedWorkOrder.docId && workOrder.data.workCenterId === updatedWorkOrder.data.workCenterId
          ? updatedWorkOrder
          : workOrder,
      ),
    );
  }

  delete(workOrder: WorkOrderDocument): void {
    this.workOrders.update((workOrders) => workOrders.filter((item) => item.docId !== workOrder.docId));
  }

  loadSampleData(): void {
    this.workCenters.set(SAMPLE_WORK_CENTERS);
    this.workOrders.set(SAMPLE_WORK_ORDERS);
  }
}
