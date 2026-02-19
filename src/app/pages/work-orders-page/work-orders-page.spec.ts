import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrdersPage } from './work-orders-page';

describe('WorkOrdersPage', () => {
  let component: WorkOrdersPage;
  let fixture: ComponentFixture<WorkOrdersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrdersPage],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrdersPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
