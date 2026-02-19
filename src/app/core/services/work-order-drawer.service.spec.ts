import { TestBed } from '@angular/core/testing';

import { WorkOrderFormData } from '../../pages/work-orders-page/work-order-drawer/work-order-form/work-order-form';
import { WorkOrderDrawerService } from './work-order-drawer.service';

describe('WorkOrderDrawerService', () => {
  let service: WorkOrderDrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrderDrawerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open the drawer with data', () => {
    const data: WorkOrderFormData = {
      mode: 'create',
      workOrder: {
        docId: '1',
        docType: 'workOrder',
        data: { name: 'Test', workCenterId: 'c', status: 'open', startDate: '2026-01-01', endDate: '2026-01-02' },
      },
      currentWorkOrders: [],
    };
    service.openDrawer(data);
    expect(service.drawerState()).toEqual(data);
  });

  it('should close the drawer', () => {
    const data: WorkOrderFormData = {
      mode: 'edit',
      workOrder: {
        docId: '2',
        docType: 'workOrder',
        data: { name: 'Test2', workCenterId: 'c', status: 'open', startDate: '2026-01-01', endDate: '2026-01-02' },
      },
      currentWorkOrders: [],
    };
    service.openDrawer(data);
    service.closeDrawer();
    expect(service.drawerState()).toBeNull();
  });
});
