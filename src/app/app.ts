import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { WorkOrdersPage } from './pages/work-orders-page/work-orders-page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, WorkOrdersPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('Work Order Schedule Yimeline');
}
