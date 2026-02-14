import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PageHeader } from './page-header/page-header';
import { Title } from '@angular/platform-browser';
import { Timeline } from './timeline/timeline';
import { WorkOrderDrawer } from './work-order-drawer/work-order-drawer';
import { WorkOrderDocument } from '../../core/models/work-order.model';

@Component({
  selector: 'app-work-orders-page',
  standalone: true,
  imports: [CommonModule, PageHeader, Timeline, WorkOrderDrawer],
  templateUrl: './work-orders-page.html',
  styleUrl: './work-orders-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrdersPage implements OnInit {
  private titleService = inject(Title);

  selectedWorkOrder = signal<WorkOrderDocument>({
    docId: 'Edwin',
    docType: 'workOrder',
    data: {
      name: 'Edwin',
      workCenterId: 'Condi',
      status: 'complete',
      startDate: '2025-01-01',
      endDate: '2025-01-20',
    },
  });

  ngOnInit(): void {
    this.titleService.setTitle('Naologic: Work Orders');
  }
}
