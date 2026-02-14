import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimescaleSelect } from './timescale-select';

describe('TimescaleSelect', () => {
  let component: TimescaleSelect;
  let fixture: ComponentFixture<TimescaleSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimescaleSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(TimescaleSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
