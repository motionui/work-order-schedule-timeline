import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCenter } from './work-center';

describe('WorkCenter', () => {
  let component: WorkCenter;
  let fixture: ComponentFixture<WorkCenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkCenter],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkCenter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
