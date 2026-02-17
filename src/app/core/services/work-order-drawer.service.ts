import { Injectable, signal } from '@angular/core';
import { WorkOrderFormData } from '../../pages/work-orders-page/work-order-drawer/work-order-form/work-order-form';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderDrawerService {
  drawerState = signal<WorkOrderFormData | null>(null);

  openDrawer(data: WorkOrderFormData) {
    this.drawerState.set(data);
  }

  closeDrawer() {
    this.drawerState.set(null);
  }
}
