/**
 * Calculate the number of tickets sold between two numbers
 */
export function calculateSoldCount(prevNum, currentNum, bookSize) {
  if (prevNum === -1) return 0;
  if (isNaN(prevNum) || isNaN(bookSize)) return 0;
  if (isNaN(currentNum)) return 0;
  if (currentNum === -1) return prevNum + 1;
  if (currentNum === prevNum) return 0;
  if (currentNum < prevNum) return prevNum - currentNum;
  return (prevNum + 1) + ((bookSize - 1) - currentNum);
}

/**
 * Calculate total expected cash for a shift
 */
export function calculateExpectedCash(onlineSales, onlineCashes, instantCashes, totalScratchSales) {
  return onlineSales - onlineCashes - instantCashes + totalScratchSales;
}

/**
 * Calculate difference between actual and expected cash
 */
export function calculateDifference(actualCash, expectedCash) {
  return actualCash - expectedCash;
}

/**
 * Format difference as currency string
 */
export function formatDifference(difference) {
  const sign = difference >= 0 ? '' : '-';
  return `${sign}$${Math.abs(difference).toFixed(2)}`;
}

