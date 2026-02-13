import { TestBed } from '@angular/core/testing';

import { WorkOrderStore } from './work-order.store';

describe('WorkOrderStore', () => {
  let service: WorkOrderStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrderStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
