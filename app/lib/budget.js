/**
 * Pure budget arithmetic — testable without React.
 */

/**
 * Sum all budget amounts.
 * @param {Array<[string, number]>} items - [[category, amount], ...]
 * @returns {number}
 */
export function calcTotal(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const val = Number(item?.[1]);
    return sum + (Number.isFinite(val) ? val : 0);
  }, 0);
}

/**
 * Calculate remaining = budgeted − actual for a single row.
 * @param {number} budgeted
 * @param {number} actual
 * @returns {number}
 */
export function calcRemaining(budgeted, actual) {
  const b = Number.isFinite(budgeted) ? budgeted : 0;
  const a = Number.isFinite(actual) ? actual : 0;
  return b - a;
}

/**
 * Calculate variance = actual − budgeted (positive = over budget).
 * @param {number} budgeted
 * @param {number} actual
 * @returns {number}
 */
export function calcVariance(budgeted, actual) {
  const b = Number.isFinite(budgeted) ? budgeted : 0;
  const a = Number.isFinite(actual) ? actual : 0;
  return a - b;
}

/**
 * Return a variance class name for styling.
 * @param {number} variance - positive = over budget
 * @returns {'good'|'warn'|'bad'|''}
 */
export function varianceClass(variance) {
  if (!Number.isFinite(variance) || variance === 0) return '';
  if (variance < 0) return 'good';   // under budget
  if (variance <= 20) return 'warn';  // near budget
  return 'bad';                       // over budget
}

/**
 * Build full budget summary from items + actuals map.
 * @param {Array<[string, number]>} items
 * @param {Object<string, number>} actuals - { categoryName: actualAmount }
 * @returns {{ rows: Array, totalBudget: number, totalActual: number, totalRemaining: number }}
 */
export function buildBudgetSummary(items, actuals = {}) {
  if (!Array.isArray(items)) return { rows: [], totalBudget: 0, totalActual: 0, totalRemaining: 0 };

  let totalBudget = 0;
  let totalActual = 0;

  const rows = items.map(([category, amount]) => {
    const budgeted = Number.isFinite(amount) ? amount : 0;
    const actual = Number.isFinite(actuals[category]) ? actuals[category] : 0;
    const remaining = calcRemaining(budgeted, actual);
    const variance = calcVariance(budgeted, actual);
    totalBudget += budgeted;
    totalActual += actual;
    return { category, budgeted, actual, remaining, variance, cls: varianceClass(variance) };
  });

  return {
    rows,
    totalBudget,
    totalActual,
    totalRemaining: totalBudget - totalActual,
  };
}
