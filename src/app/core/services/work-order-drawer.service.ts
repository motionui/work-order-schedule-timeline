import { Injectable, signal } from '@angular/core';

import { WorkOrderFormData } from '../../pages/work-orders-page/work-order-drawer/work-order-form/work-order-form';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderDrawerService {
  drawerState = signal<WorkOrderFormData | null>(null);

  // Method to open the drawer with the provided form data
  openDrawer(data: WorkOrderFormData) {
    this.drawerState.set(data);
  }

  // Method to close the drawer by clearing signal state
  closeDrawer() {
    this.drawerState.set(null);
  }
}
