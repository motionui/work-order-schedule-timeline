import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { WorkCenterDocument } from '../models/work-center.model';
import { WorkOrderDocument } from '../models/work-order.model';
import { SAMPLE_WORK_CENTERS, SAMPLE_WORK_ORDERS } from './mock-data';
import { WorkOrdersRepository } from './work-orders-repostory';

@Injectable()
export class MockDataRepository extends WorkOrdersRepository {
  protected fetchWorkCenters(): Observable<WorkCenterDocument[]> {
    return of(SAMPLE_WORK_CENTERS);
  }

  protected fetchWorkOrders(): Observable<WorkOrderDocument[]> {
    return of(SAMPLE_WORK_ORDERS);
  }

  protected persistAdd(workOrder: WorkOrderDocument): Observable<WorkOrderDocument> {
    return of(workOrder);
  }

  protected persistUpdate(workOrder: WorkOrderDocument): Observable<WorkOrderDocument> {
    return of(workOrder);
  }

  protected persistDelete(workOrder: WorkOrderDocument): Observable<void> {
    return of(void 0);
  }
}
