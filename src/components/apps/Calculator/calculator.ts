export type Operator = '+' | '-' | '*' | '/';
export type CalculatorState = {
	display: string;
	stored: number | null;
	operator: Operator | null;
	waiting: boolean;
	repeatOperator: Operator | null;
	repeatOperand: number | null;
};
export const initialCalculator = (): CalculatorState => ({
	display: '0',
	stored: null,
	operator: null,
	waiting: false,
	repeatOperator: null,
	repeatOperand: null,
});
const format = (n: number): string => {
	if (!Number.isFinite(n)) return 'Error';
	const value = Number(n.toPrecision(12));
	return String(value).length > 14 ? value.toExponential(7) : String(value);
};
const calculate = (a: number, b: number, op: Operator): number => {
	switch (op) {
		case '+':
			return a + b;
		case '-':
			return a - b;
		case '*':
			return a * b;
		case '/':
			return b === 0 ? NaN : a / b;
	}
};
export function pressCalculator(previous: CalculatorState, key: string): CalculatorState {
	if (key === 'AC') return initialCalculator();
	const s = { ...previous };
	if (s.display === 'Error') {
		if (/^\d$/.test(key) || key === '.') return pressCalculator(initialCalculator(), key);
		return s;
	}
	if (/^\d$/.test(key) || key === '.') {
		if (s.waiting) {
			s.display = '0';
			s.waiting = false;
		}
		s.repeatOperator = null;
		s.repeatOperand = null;
		if (key === '.') {
			if (!s.display.includes('.')) s.display += '.';
			return s;
		}
		if (s.display.replace(/[-.]/g, '').length >= 12) return s;
		s.display = s.display === '0' ? key : s.display === '-0' ? '-' + key : s.display + key;
		return s;
	}
	if (key === 'Backspace') {
		if (!s.waiting) {
			s.display = s.display.slice(0, -1);
			if (!s.display || s.display === '-') s.display = '0';
		}
		return s;
	}
	if (key === '+/-') {
		if (s.waiting && s.operator) s.display = '0';
		s.display = s.display.startsWith('-') ? s.display.slice(1) : '-' + s.display;
		s.waiting = false;
		s.repeatOperator = null;
		s.repeatOperand = null;
		return s;
	}
	if (key === '%') {
		const n = Number(s.display) / 100;
		s.display = format(
			s.stored !== null && (s.operator === '+' || s.operator === '-') ? s.stored * n : n,
		);
		s.waiting = false;
		s.repeatOperator = null;
		s.repeatOperand = null;
		return s;
	}
	if (['+', '-', '*', '/'].includes(key)) {
		if (s.operator && s.stored !== null && !s.waiting)
			s.display = format(calculate(s.stored, Number(s.display), s.operator));
		if (s.display === 'Error') return { ...initialCalculator(), display: 'Error' };
		s.stored = Number(s.display);
		s.operator = key as Operator;
		s.waiting = true;
		s.repeatOperator = null;
		s.repeatOperand = null;
		return s;
	}
	if (key === '=') {
		if (s.operator && s.stored !== null) {
			s.repeatOperand = Number(s.display);
			s.repeatOperator = s.operator;
			s.display = format(calculate(s.stored, s.repeatOperand, s.operator));
			s.operator = null;
			s.stored = null;
		} else if (s.repeatOperator && s.repeatOperand !== null) {
			s.display = format(calculate(Number(s.display), s.repeatOperand, s.repeatOperator));
		}
		s.waiting = true;
		return s;
	}
	return s;
}
export function calculatorKey(key: string): string | null {
	if (/^[\d.+\-*/%=]$/.test(key)) return key;
	if (key === 'Enter') return '=';
	if (key === 'Escape' || key === 'Delete') return 'AC';
	if (key === 'Backspace') return key;
	return null;
}
