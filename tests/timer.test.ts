import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	createTimer,
	remainingSeconds,
	startTimer,
	pauseTimer,
	validTimer,
} from '../src/components/apps/Focus/timer.ts';
test('default Focus timer starts at 25 minutes without running', () => {
	assert.deepEqual(createTimer(), {
		duration: 1500,
		remaining: 1500,
		deadline: null,
		mode: 'Focus',
	});
});
test('start uses an absolute deadline, including after background throttling', () => {
	const timer = startTimer(createTimer(), 1000);
	assert.equal(timer.deadline, 1501000);
	assert.equal(remainingSeconds(timer, 1000), 1500);
	assert.equal(remainingSeconds(timer, 601000), 900);
});
test('partial seconds round up and completion never becomes negative', () => {
	const timer = startTimer(createTimer(60), 1000);
	assert.equal(remainingSeconds(timer, 2001), 59);
	assert.equal(remainingSeconds(timer, 61000), 0);
	assert.equal(remainingSeconds(timer, 120000), 0);
});
test('pause freezes the remaining time and resume counts from that value', () => {
	const paused = pauseTimer(startTimer(createTimer(60), 1000), 11000);
	assert.equal(paused.remaining, 50);
	assert.equal(paused.deadline, null);
	assert.equal(remainingSeconds(paused, 999000), 50);
	const resumed = startTimer(paused, 1000000);
	assert.equal(resumed.deadline, 1050000);
	assert.equal(remainingSeconds(resumed, 1005000), 45);
});
test('completed timer can restart for the full chosen duration', () => {
	const completed = pauseTimer(startTimer(createTimer(300, 'Short break'), 1000), 400000);
	const again = startTimer(completed, 500000);
	assert.equal(again.remaining, 300);
	assert.equal(again.deadline, 800000);
	assert.equal(again.mode, 'Short break');
});
test('reopened saved timer catches up across time spent closed', () => {
	const saved = JSON.parse(JSON.stringify(startTimer(createTimer(60), 1000)));
	assert.equal(validTimer(saved), true);
	assert.equal(remainingSeconds(saved, 31000), 30);
	assert.equal(remainingSeconds(saved, 90000), 0);
});
test('backward clock changes do not push progress past the full duration', () => {
	assert.equal(remainingSeconds(startTimer(createTimer(60), 50000), 1000), 60);
});
test('invalid persisted durations, states, and deadlines are rejected', () => {
	const good = createTimer();
	for (const timer of [
		good,
		createTimer(60, 'Custom'),
		createTimer(10800, 'Custom'),
		startTimer(good, 1000),
	])
		assert.equal(validTimer(timer), true);
	for (const bad of [
		null,
		{},
		{ ...good, duration: 0 },
		{ ...good, duration: 10801 },
		{ ...good, duration: 60.5 },
		{ ...good, remaining: 1600 },
		{ ...good, remaining: -1 },
		{ ...good, remaining: 0.5 },
		{ ...good, deadline: -1 },
		{ ...good, deadline: '2000' },
		{ ...good, mode: null },
	])
		assert.equal(validTimer(bad), false);
});
