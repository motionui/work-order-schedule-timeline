import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderPage } from './work-orders-page';

describe('WorkOrderPage', () => {
  let component: WorkOrderPage;
  let fixture: ComponentFixture<WorkOrderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderPage],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrderPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
