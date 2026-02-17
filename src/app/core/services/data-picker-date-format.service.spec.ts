import { TestBed } from '@angular/core/testing';

import { DataPickerDateFormatService } from './data-picker-date-format.service';

describe('DataPickerDateFormatService', () => {
  let service: DataPickerDateFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataPickerDateFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
