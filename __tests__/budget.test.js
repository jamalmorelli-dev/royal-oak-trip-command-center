import { describe, it, expect } from 'vitest';
import { calcTotal, calcRemaining, calcVariance, varianceClass, buildBudgetSummary } from '../app/lib/budget.js';

// Known data.js budget items
const BUDGET_ITEMS = [
  ['Airfare', 1412.26],
  ['Groceries', 299],
  ['Dining / coffee', 450],
  ['School transportation', 80],
  ['Other local transport', 118],
  ['Activities', 62],
  ['Clothes / essentials', 220],
  ['School / child costs', 104],
  ['Phone / connectivity', 30],
  ['Medical / pharmacy', 50],
  ['Gifts', 50],
  ['Miscellaneous', 100],
];

describe('calcTotal', () => {
  it('sums all budget items correctly', () => {
    const total = calcTotal(BUDGET_ITEMS);
    expect(total).toBeCloseTo(2975.26, 2);
  });

  it('returns 0 for empty array', () => {
    expect(calcTotal([])).toBe(0);
  });

  it('returns 0 for null/undefined', () => {
    expect(calcTotal(null)).toBe(0);
    expect(calcTotal(undefined)).toBe(0);
  });

  it('handles non-numeric values gracefully', () => {
    expect(calcTotal([['test', 'abc']])).toBe(0);
    expect(calcTotal([['test', NaN]])).toBe(0);
  });

  it('handles single item', () => {
    expect(calcTotal([['Airfare', 1412.26]])).toBeCloseTo(1412.26, 2);
  });
});

describe('calcRemaining', () => {
  it('returns positive when under budget', () => {
    expect(calcRemaining(100, 80)).toBe(20);
  });

  it('returns 0 when exactly on budget', () => {
    expect(calcRemaining(100, 100)).toBe(0);
  });

  it('returns negative when over budget', () => {
    expect(calcRemaining(100, 130)).toBe(-30);
  });

  it('handles zero actuals', () => {
    expect(calcRemaining(100, 0)).toBe(100);
  });

  it('handles non-finite inputs', () => {
    expect(calcRemaining(NaN, 50)).toBe(-50);
    expect(calcRemaining(100, NaN)).toBe(100);
  });
});

describe('calcVariance', () => {
  it('returns negative when under budget', () => {
    expect(calcVariance(100, 80)).toBe(-20);
  });

  it('returns 0 when on budget', () => {
    expect(calcVariance(100, 100)).toBe(0);
  });

  it('returns positive when over budget', () => {
    expect(calcVariance(100, 130)).toBe(30);
  });
});

describe('varianceClass', () => {
  it('returns good for under budget', () => {
    expect(varianceClass(-20)).toBe('good');
  });

  it('returns warn for slightly over budget', () => {
    expect(varianceClass(15)).toBe('warn');
  });

  it('returns bad for significantly over budget', () => {
    expect(varianceClass(50)).toBe('bad');
  });

  it('returns empty string for zero', () => {
    expect(varianceClass(0)).toBe('');
  });

  it('returns empty string for NaN', () => {
    expect(varianceClass(NaN)).toBe('');
  });
});

describe('buildBudgetSummary', () => {
  it('builds correct summary with no actuals', () => {
    const result = buildBudgetSummary(BUDGET_ITEMS, {});
    expect(result.totalBudget).toBeCloseTo(2975.26, 2);
    expect(result.totalActual).toBe(0);
    expect(result.totalRemaining).toBeCloseTo(2975.26, 2);
    expect(result.rows).toHaveLength(12);
  });

  it('builds correct summary with partial actuals', () => {
    const actuals = { Groceries: 150, 'Dining / coffee': 200 };
    const result = buildBudgetSummary(BUDGET_ITEMS, actuals);
    expect(result.totalActual).toBe(350);
    expect(result.totalRemaining).toBeCloseTo(2975.26 - 350, 2);

    const groceryRow = result.rows.find((r) => r.category === 'Groceries');
    expect(groceryRow.actual).toBe(150);
    expect(groceryRow.remaining).toBe(149);
    expect(groceryRow.variance).toBe(-149);
    expect(groceryRow.cls).toBe('good');
  });

  it('detects over-budget correctly', () => {
    const actuals = { Groceries: 400 };
    const result = buildBudgetSummary(BUDGET_ITEMS, actuals);
    const groceryRow = result.rows.find((r) => r.category === 'Groceries');
    expect(groceryRow.variance).toBe(101);
    expect(groceryRow.cls).toBe('bad');
  });

  it('handles null/undefined items', () => {
    const result = buildBudgetSummary(null);
    expect(result.rows).toEqual([]);
    expect(result.totalBudget).toBe(0);
  });
});
