import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRange } from '../timeline';
import { TimelineHeader } from './timeline-header';

describe('TimelineHeader', () => {
  let component: TimelineHeader;
  let fixture: ComponentFixture<TimelineHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineHeader);
    component = fixture.componentInstance;
    // Use setInput for required input
    await fixture.componentRef.setInput('dateRange', {
      start: new Date('2026-02-01'),
      end: new Date('2026-02-28'),
    } as DateRange);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
