import { Injectable, signal } from '@angular/core';
import { WorkOrderDocument } from '../models/work-order.model';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderDrawerService {
  selectedWorkOrder = signal<WorkOrderDocument | null>(null);

  openDrawer(order: WorkOrderDocument) {
    this.selectedWorkOrder.set(order);
  }

  closeDrawer() {
    this.selectedWorkOrder.set(null);
  }
}
