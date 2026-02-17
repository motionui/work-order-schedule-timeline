import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, TemplateRef, ViewChild } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap/offcanvas';
import { WorkOrderDocument } from '../../../core/models/work-order.model';
import { WorkOrderForm } from '../work-order-form/work-order-form';
import { WorkOrderDrawerService } from '../../../core/services/work-order-drawer.service';

@Component({
  selector: 'app-work-order-drawer',
  standalone: true,
  imports: [CommonModule, WorkOrderForm],
  templateUrl: './work-order-drawer.html',
  styleUrl: './work-order-drawer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderDrawer {
  private offCanvas = inject(NgbOffcanvas);
  private workOrderDrawerService = inject(WorkOrderDrawerService);

  @ViewChild('content', { static: true })
  content!: TemplateRef<any>;

  workOrder = input<WorkOrderDocument | null>(null);
  private offcanvasRef?: NgbOffcanvasRef;

  constructor() {
    effect(() => {
      const wo = this.workOrder();

      if (wo && !this.offcanvasRef) {
        this.open();
      }

      if (!wo && this.offcanvasRef) {
        this.offcanvasRef.close();
        this.offcanvasRef = undefined;
      }
    });
  }

  private open() {
    this.offcanvasRef = this.offCanvas.open(this.content, {
      position: 'end',
      // in order to maintain style isolation and prevent future accidentially leak
      // the following selectors are placed in the global styles.scss
      panelClass: 'work-order-drawer',
      backdropClass: 'work-order-backdrop',
    });

    this.offcanvasRef.result
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        this.offcanvasRef = undefined;
        this.workOrderDrawerService.selectedWorkOrder.set(null);
      });
  }
}
