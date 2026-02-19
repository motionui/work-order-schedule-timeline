/**
 * Component for the work order drawer, which uses NgbOffcanvas to display a form for creating or editing work orders, and listens to the WorkOrderDrawerService for state changes to open or close the drawer accordingly
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, TemplateRef, ViewChild } from '@angular/core';

import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap/offcanvas';
import { WorkOrderDrawerService } from '../../../core/services/work-order-drawer.service';
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

  @ViewChild('content', { static: true }) content!: TemplateRef<any>;

  private offcanvasRef?: NgbOffcanvasRef;

  /**
   * The drawer now simply reflects the service state.
   * If drawerState is null → drawer closed
   * If drawerState has value → drawer open
   */
  readonly formData = computed<WorkOrderFormData | null>(() => this.drawerService.drawerState());

  constructor() {
    effect(() => {
      const state = this.drawerService.drawerState();

      // Open drawer when state exists
      if (state && !this.offcanvasRef) {
        this.open();
      }

      // Close drawer when state is cleared
      if (!state && this.offcanvasRef) {
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

    // setting focus to the first input when the drawer is opened for better UX and accessibility
    // doing this directly on the ngb offcanvas shown event to ensure the offcanvas is fully rendered before trying to focus the input
    this.offcanvasRef.shown.subscribe(() => {
      // wait 1 frame so offcanvas layout is settled
      requestAnimationFrame(() => {
        const element = document.getElementById('name') as HTMLInputElement | null;
        element?.focus();
        element?.select();
      });
    });

    // close the draw when the user clicks outside of it or presses the escape key, and clear the drawer state in the service to reflect that it's closed
    this.offcanvasRef.result.finally(() => {
      this.offcanvasRef = undefined;
      this.drawerService.closeDrawer();
    });
  }
}
