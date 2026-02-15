import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCenterColumn } from './work-center-column';

describe('WorkCenterColumn', () => {
  let component: WorkCenterColumn;
  let fixture: ComponentFixture<WorkCenterColumn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkCenterColumn],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkCenterColumn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
