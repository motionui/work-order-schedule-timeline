import { TestBed } from '@angular/core/testing';

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
});
