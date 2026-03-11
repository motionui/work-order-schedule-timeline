import { TestBed } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';
import { SAMPLE_WORK_ORDERS } from './mock-data';
import { LocalStorageRepository } from './local-storage-repository';

describe('LocalStorageRepository', () => {
  let service: LocalStorageRepository;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('seeds work orders into localStorage on first load', async () => {
    const workOrders = await firstValueFrom(service.loadWorkOrders());

    expect(workOrders.length).toBe(SAMPLE_WORK_ORDERS.length);
    expect(localStorage.getItem('naologic.work-orders')).toBeTruthy();
  });

  it('persists add and serves updated data on reload', async () => {
    await firstValueFrom(service.loadWorkOrders());

    const created = {
      ...SAMPLE_WORK_ORDERS[0],
      docId: 'new-wo-id',
      data: {
        ...SAMPLE_WORK_ORDERS[0].data,
        name: 'New Work Order',
      },
    };

    await firstValueFrom(service.addWorkOrder(created));
    const reloaded = await firstValueFrom(service.loadWorkOrders());

    expect(reloaded.some((order) => order.docId === 'new-wo-id')).toBe(true);
  });

  it('persists update and delete operations', async () => {
    const initial = await firstValueFrom(service.loadWorkOrders());
    const target = initial[0];

    await firstValueFrom(
      service.updateWorkOrder({
        ...target,
        data: {
          ...target.data,
          name: 'Updated Work Order Name',
        },
      }),
    );

    const afterUpdate = await firstValueFrom(service.loadWorkOrders());
    expect(afterUpdate.find((order) => order.docId === target.docId)?.data.name).toBe('Updated Work Order Name');

    await firstValueFrom(service.deleteWorkOrder(target));
    const afterDelete = await firstValueFrom(service.loadWorkOrders());

    expect(afterDelete.some((order) => order.docId === target.docId)).toBe(false);
  });
});
