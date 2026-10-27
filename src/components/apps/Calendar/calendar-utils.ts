import { getDay, getMonth, getYear, startOfMonth } from 'date-fns';
import { DAYS, DAYS_LEAP, NUMBER_OF_CELLS_IN_CALENDAR } from './calendar-constants.ts';
export function is_leap_year(year: number) {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
export function get_range_array(lower: number, upper: number) {
	const arr: number[] = [];
	for (let i = lower + 1; i <= upper; i++) {
		arr.push(i);
	}
	return arr;
}
export function get_display_days(selectedDate: Date) {
	const this_month = getMonth(selectedDate);
	const prev_month = this_month - 1 < 0 ? 11 : this_month - 1;
	const days = is_leap_year(getYear(selectedDate)) ? DAYS_LEAP : DAYS;
	const weekday = getDay(startOfMonth(selectedDate));
	const days_to_show_in_prev_month = weekday === 0 ? 6 : weekday - 1;
	const days_to_show_in_next_month =
		NUMBER_OF_CELLS_IN_CALENDAR - days[this_month] - days_to_show_in_prev_month;
	const days_in_prev_month = get_range_array(
		days[prev_month] - days_to_show_in_prev_month,
		days[prev_month],
	);
	const days_in_this_month = get_range_array(0, days[this_month]);
	const days_in_next_month = get_range_array(0, days_to_show_in_next_month);
	return {
		days_in_prev_month,
		days_in_this_month,
		days_in_next_month,
	};
}
