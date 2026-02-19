import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRange } from '../timeline';
import { WorkCenterTimeline } from './work-center-timeline';

describe('WorkCenterTimeline', () => {
  let component: WorkCenterTimeline;
  let fixture: ComponentFixture<WorkCenterTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkCenterTimeline],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkCenterTimeline);
    component = fixture.componentInstance;
    // Use setInput for required inputs (no need for await, setInput is synchronous in Angular 17+)
    fixture.componentRef.setInput('dateRange', {
      start: new Date('2026-02-01'),
      end: new Date('2026-02-28'),
    } as DateRange);
    fixture.componentRef.setInput('workCenter', { docId: '1', docType: 'workCenter', data: { name: 'Test Center' } });
    fixture.componentRef.setInput('workOrders', []);
    fixture.componentRef.setInput('timescale', 'day');
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
