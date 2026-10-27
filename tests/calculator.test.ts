import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	initialCalculator,
	pressCalculator,
	calculatorKey,
} from '../src/components/apps/Calculator/calculator.ts';
const run = (...keys: string[]) => keys.reduce(pressCalculator, initialCalculator()).display;
const cases: [string, string[], string][] = [
	['addition', ['1', '2', '+', '7', '='], '19'],
	['subtraction', ['9', '-', '1', '2', '='], '-3'],
	['multiplication', ['6', '*', '7', '='], '42'],
	['division', ['8', '/', '2', '='], '4'],
	['decimal precision', ['0', '.', '1', '+', '0', '.', '2', '='], '0.3'],
	['only one decimal', ['1', '.', '.', '5'], '1.5'],
	['leading decimal', ['.', '5', '*', '2', '='], '1'],
	['change sign', ['5', '+/-', '*', '2', '='], '-10'],
	['negative second operand', ['5', '+', '+/-', '2', '='], '3'],
	['standalone percent', ['5', '0', '%'], '0.5'],
	['add percent', ['2', '0', '0', '+', '1', '0', '%', '='], '220'],
	['subtract percent', ['2', '0', '0', '-', '1', '0', '%', '='], '180'],
	['multiply percent', ['2', '0', '0', '*', '1', '0', '%', '='], '20'],
	['sequential operations', ['2', '+', '3', '*', '4', '='], '20'],
	['replace pending operator', ['8', '+', '*', '2', '='], '16'],
	['repeated equals', ['2', '+', '3', '=', '=', '='], '11'],
	['new entry after equals', ['2', '+', '3', '=', '7'], '7'],
	['continue from result', ['2', '+', '3', '=', '*', '4', '='], '20'],
	['divide by zero', ['8', '/', '0', '='], 'Error'],
	['recover from error with digit', ['8', '/', '0', '=', '4', '+', '1', '='], '5'],
	['clear pending calculation', ['5', '+', '3', 'AC', '2', '='], '2'],
	['backspace', ['1', '2', '3', 'Backspace'], '12'],
	['backspace last digit', ['3', 'Backspace'], '0'],
	['input length', [...'1234567890123'], '123456789012'],
	['leading zero', ['0', '0', '2'], '2'],
];
for (const [name, keys, expected] of cases) test(name, () => assert.equal(run(...keys), expected));
test('keyboard mapping', () => {
	assert.equal(calculatorKey('Enter'), '=');
	assert.equal(calculatorKey('Escape'), 'AC');
	assert.equal(calculatorKey('Delete'), 'AC');
	assert.equal(calculatorKey('Backspace'), 'Backspace');
	assert.equal(calculatorKey('a'), null);
	assert.equal(calculatorKey('Tab'), null);
	for (const k of '0123456789.+-*/%=') assert.equal(calculatorKey(k), k);
});
