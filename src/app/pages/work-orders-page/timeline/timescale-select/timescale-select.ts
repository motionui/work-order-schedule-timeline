// @upgrade Add ARIA roles and labels to timescale select dropdown for accessibility
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

export type Timescale = 'day' | 'week' | 'month';

@Component({
  selector: 'app-timescale-select',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './timescale-select.html',
  styleUrl: './timescale-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimescaleSelect {
  selected = model<Timescale>('day');

  protected options: { label: string; value: Timescale }[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  selectedLabel = computed(() => this.options.find((item) => item.value === this.selected())?.label ?? '');
}
