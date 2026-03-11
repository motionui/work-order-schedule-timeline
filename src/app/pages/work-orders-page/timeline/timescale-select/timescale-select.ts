/**
 * Component to allow the user to select the timescale for the timeline (day, week, month),
 * with the selected value stored in a model and the label computed for display in the dropdown
 */

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
  selected = model.required<Timescale>();

  protected options: { label: string; value: Timescale }[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  // whenever the selected timescale changes, compute the corresponding label from the options array for display in the dropdown
  selectedLabel = computed(() => this.options.find((item) => item.value === this.selected())?.label ?? '');
}
