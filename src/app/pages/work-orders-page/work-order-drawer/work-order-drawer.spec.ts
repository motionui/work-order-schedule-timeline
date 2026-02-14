import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderDrawer } from './work-order-drawer';

describe('WorkOrderDrawer', () => {
  let component: WorkOrderDrawer;
  let fixture: ComponentFixture<WorkOrderDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderDrawer],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrderDrawer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
