export type TimerState = {
	duration: number;
	remaining: number;
	deadline: number | null;
	mode: string;
};
export const createTimer = (seconds = 1500, mode = 'Focus'): TimerState => ({
	duration: seconds,
	remaining: seconds,
	deadline: null,
	mode,
});
export const remainingSeconds = (timer: TimerState, now: number): number =>
	timer.deadline === null
		? timer.remaining
		: Math.min(timer.duration, Math.max(0, Math.ceil((timer.deadline - now) / 1000)));
export function startTimer(timer: TimerState, now: number): TimerState {
	const remaining = timer.remaining > 0 ? timer.remaining : timer.duration;
	return { ...timer, remaining, deadline: now + remaining * 1000 };
}
export const pauseTimer = (timer: TimerState, now: number): TimerState => ({
	...timer,
	remaining: remainingSeconds(timer, now),
	deadline: null,
});
export const validTimer = (v: any): boolean =>
	!!v &&
	Number.isInteger(v.duration) &&
	v.duration >= 60 &&
	v.duration <= 10800 &&
	Number.isInteger(v.remaining) &&
	v.remaining >= 0 &&
	v.remaining <= v.duration &&
	(v.deadline === null || (Number.isFinite(v.deadline) && v.deadline > 0)) &&
	typeof v.mode === 'string';
