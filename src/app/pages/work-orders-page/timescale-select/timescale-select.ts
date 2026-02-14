import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, model, signal, ViewChild } from '@angular/core';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap/dropdown';

export type Timescale = 'hour' | 'day' | 'week' | 'month';

@Component({
  selector: 'app-timescale-select',
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem],
  templateUrl: './timescale-select.html',
  styleUrl: './timescale-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimescaleSelect {
  @ViewChild('dropdown') dropdown!: NgbDropdown;

  selected = model<Timescale>('month');
  menuOpen = signal(false);

  protected options: { label: string; value: Timescale }[] = [
    { label: 'Hour', value: 'hour' },
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  // computed signal
  selectedLabel = computed(() => this.options.find((item) => item.value === this.selected())?.label ?? '');
}
