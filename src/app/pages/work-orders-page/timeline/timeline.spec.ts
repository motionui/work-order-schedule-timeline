import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCenterDocument } from '../../../core/models/work-center.model';
import { WorkOrderDocument } from '../../../core/models/work-order.model';
import { WorkOrderStore } from '../../../core/services/work-order.store';
import { Timeline } from './timeline';

const mockWorkCenters: WorkCenterDocument[] = [
  { docId: '1', docType: 'workCenter', data: { name: 'Center 1' } },
  { docId: '2', docType: 'workCenter', data: { name: 'Center 2' } },
];
const mockWorkOrders: WorkOrderDocument[] = [
  {
    docId: 'a',
    docType: 'workOrder',
    data: { name: 'Order 1', workCenterId: '1', status: 'open', startDate: '2026-02-01', endDate: '2026-02-02' },
  },
  {
    docId: 'b',
    docType: 'workOrder',
    data: { name: 'Order 2', workCenterId: '2', status: 'in-progress', startDate: '2026-02-03', endDate: '2026-02-04' },
  },
];

class MockWorkOrderStore {
  workCenters$ = () => mockWorkCenters;
  workOrders$ = () => mockWorkOrders;
  loadSampleData = () => {};
}

describe('Timeline', () => {
  let component: Timeline;
  let fixture: ComponentFixture<Timeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Timeline],
      providers: [{ provide: WorkOrderStore, useClass: MockWorkOrderStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(Timeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute visibleStartDate and visibleEndDate for day scale', () => {
    component.timescale.set('day');
    const start = component.visibleStartDate();
    const end = component.visibleEndDate();
    expect(start).toBeInstanceOf(Date);
    expect(end).toBeInstanceOf(Date);
    expect(end.getTime()).toBeGreaterThan(start.getTime());
  });

  it('should compute visibleStartDate and visibleEndDate for week scale', () => {
    component.timescale.set('week');
    const start = component.visibleStartDate();
    const end = component.visibleEndDate();
    expect(start).toBeInstanceOf(Date);
    expect(end).toBeInstanceOf(Date);
    expect(end.getTime()).toBeGreaterThan(start.getTime());
  });

  it('should compute visibleStartDate and visibleEndDate for month scale', () => {
    component.timescale.set('month');
    const start = component.visibleStartDate();
    const end = component.visibleEndDate();
    expect(start).toBeInstanceOf(Date);
    expect(end).toBeInstanceOf(Date);
    expect(end.getTime()).toBeGreaterThan(start.getTime());
  });

  it('should compute todayIndex correctly when today is visible', () => {
    component.timescale.set('day');
    const idx = component.todayIndex();
    expect(typeof idx).toBe('number');
    expect(idx).toBeGreaterThanOrEqual(0);
  });

  it('should return -1 for todayIndex when today is not visible', () => {
    // Simulate today before visible range
    const origToday = component['today'];
    (component as any)['today'] = new Date('2000-01-01');
    component.timescale.set('day');
    expect(component.todayIndex()).toBe(-1);
    (component as any)['today'] = origToday;
  });

  it('should compute todayLeft for week and month', () => {
    component.timescale.set('week');
    expect(typeof component.todayLeft()).toBe('number');
    component.timescale.set('month');
    expect(typeof component.todayLeft()).toBe('number');
  });

  it('should group work orders by work center', () => {
    const groups = component.workOrdersGroupByWorkCenters();
    expect(Array.isArray(groups)).toBe(true);
    if (groups.length > 0) {
      expect(Object.prototype.hasOwnProperty.call(groups[0], 'workCenter')).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(groups[0], 'workOrders')).toBe(true);
    }
  });
});
