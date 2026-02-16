import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timescale, TimescaleSelect } from '../timescale-select/timescale-select';
import { WorkCenter } from '../work-center/work-center';
import { WorkCenterDocument } from '../../../core/models/work-center.model';
import { WorkOrderStore } from '../../../core/services/work-order.store';
import { WorkCenterTimeline } from '../work-center-timeline/work-center-timeline';
import { WorkOrderDocument } from '../../../core/models/work-order.model';
import { TimelineHeader } from '../timeline-header/timeline-header';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TimescaleSelect, WorkCenter, WorkCenterTimeline, TimelineHeader],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timeline implements OnInit {
  private readonly store = inject(WorkOrderStore);

  zoomLevel = signal<Timescale>('day');
  hoveredWorkCenter = signal<WorkCenterDocument | null>(null);

  workOrdersGroupByWorkCenters = computed<{ workCenter: WorkCenterDocument; workOrders: WorkOrderDocument[] }[]>(() => {
    const centers = this.store.workCenters$();
    const orders = this.store.workOrders$();

    const map = new Map<string, WorkOrderDocument[]>();

    for (const order of orders) {
      const key = order.data.workCenterId;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(order);
    }

    return centers.map((center) => ({
      workCenter: center,
      workOrders: map.get(center.docId) ?? [],
    }));
  });

  ngOnInit(): void {
    this.store.loadSampleData();

    console.log(this.workOrdersGroupByWorkCenters());
  }
}
