import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, model, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

export type Timescale = 'hour' | 'day' | 'week' | 'month';

@Component({
  selector: 'app-timescale-select',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './timescale-select.html',
  styleUrl: './timescale-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimescaleSelect {
  selected = model<Timescale>('month');

  protected options: { label: string; value: Timescale }[] = [
    { label: 'Hour', value: 'hour' },
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  selectedLabel = computed(() => this.options.find((item) => item.value === this.selected())?.label ?? '');
}
