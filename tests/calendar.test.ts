import { test } from 'node:test';
import assert from 'node:assert/strict';
import { get_display_days, is_leap_year } from '../src/components/apps/Calendar/calendar-utils.ts';

test('Gregorian leap-year rules include century exceptions', () => {
	assert.equal(is_leap_year(2024), true);
	assert.equal(is_leap_year(2025), false);
	assert.equal(is_leap_year(1900), false);
	assert.equal(is_leap_year(2000), true);
});
test('February and March respect leap-year month lengths', () => {
	assert.equal(get_display_days(new Date(2024, 1, 1)).days_in_this_month.length, 29);
	assert.equal(get_display_days(new Date(2025, 1, 1)).days_in_this_month.length, 28);
	assert.equal(get_display_days(new Date(2024, 2, 1)).days_in_prev_month.at(-1), 29);
	assert.equal(get_display_days(new Date(2025, 2, 1)).days_in_prev_month.at(-1), 28);
});
test('all months fill 42 cells with a Monday-first week', () => {
	for (let year = 2023; year <= 2028; year++)
		for (let month = 0; month < 12; month++) {
			const date = new Date(year, month, 1);
			const days = get_display_days(date);
			assert.equal(
				days.days_in_prev_month.length +
					days.days_in_this_month.length +
					days.days_in_next_month.length,
				42,
			);
			assert.equal(days.days_in_prev_month.length, (date.getDay() + 6) % 7);
			assert.equal(days.days_in_this_month.at(-1), new Date(year, month + 1, 0).getDate());
		}
});
