import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { PageHeader } from './page-header/page-header';
import { Timeline } from './timeline/timeline';
import { WorkOrderDrawer } from './work-order-drawer/work-order-drawer';

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

  ngOnInit(): void {
    this.titleService.setTitle('Naologic: Work Orders');
  }
}
