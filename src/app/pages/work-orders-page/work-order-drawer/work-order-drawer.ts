import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, computed, effect, inject } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap/offcanvas';

import { WorkOrderDrawerService } from '../../../core/services/work-order-drawer.service';
import { WorkOrderStore } from '../../../core/services/work-order.store';
import { WorkOrderForm, WorkOrderFormData } from './work-order-form/work-order-form';

@Component({
  selector: 'app-work-order-drawer',
  standalone: true,
  imports: [CommonModule, WorkOrderForm],
  templateUrl: './work-order-drawer.html',
  styleUrl: './work-order-drawer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderDrawer {
  private readonly offCanvas = inject(NgbOffcanvas);
  private readonly drawerService = inject(WorkOrderDrawerService);
  private readonly store = inject(WorkOrderStore);

  @ViewChild('content', { static: true }) content!: TemplateRef<any>;

  private offcanvasRef?: NgbOffcanvasRef;

  readonly formData = computed<WorkOrderFormData | null>(() => {
    const workOrder = this.drawerService.selectedWorkOrder();
    if (!workOrder) {
      return null;
    }

    return {
      mode: 'edit',
      workOrder,
      currentWorkOrders: this.store.workOrders$(),
    };
  });

  constructor() {
    effect(() => {
      const workOrder = this.drawerService.selectedWorkOrder();

      // open when we have a work order
      if (workOrder && !this.offcanvasRef) {
        this.open();
      }

      // close when cleared
      if (!workOrder && this.offcanvasRef) {
        this.offcanvasRef.close();
        this.offcanvasRef = undefined;
      }
    });
  }

  private open() {
    this.offcanvasRef = this.offCanvas.open(this.content, {
      position: 'end',
      panelClass: 'work-order-drawer',
      backdropClass: 'work-order-backdrop',
    });

    this.offcanvasRef.result.finally(() => {
      this.offcanvasRef = undefined;
      // Ensure state resets when user closes by ESC/backdrop
      this.drawerService.closeDrawer();
    });
  }
}
