import { Timescale } from '../../pages/work-orders-page/timeline/timescale-select/timescale-select';

export const TIMESCALE_UNIT_DAY_WIDTH_PX = 150;
export const TIMESCALE_UNIT_WEEK_WIDTH_PX = 1200;
export const TIMESCALE_UNIT_MONTH_WIDTH_PX = 5000;

// must match $timescale-unit-width-day, $timescale-unit-width-week, $timescale-unit-width-month in _variables.scss
export const TIMESCALE_UNIT_WIDTH_LOOKUP: Record<Timescale, number> = {
  day: TIMESCALE_UNIT_DAY_WIDTH_PX,
  week: TIMESCALE_UNIT_WEEK_WIDTH_PX,
  month: TIMESCALE_UNIT_MONTH_WIDTH_PX,
};

export function getTimescaleUnitWidth(scale: Timescale): number {
  return TIMESCALE_UNIT_WIDTH_LOOKUP[scale];
}
