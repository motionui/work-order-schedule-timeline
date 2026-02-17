import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
