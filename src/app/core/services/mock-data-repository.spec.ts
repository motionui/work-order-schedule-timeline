import { TestBed } from '@angular/core/testing';

import { MockDataRepository } from './mock-data-repository';

describe('MockDataRepository', () => {
  let service: MockDataRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDataRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
