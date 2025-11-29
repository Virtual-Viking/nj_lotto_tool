/**
 * Calculate the number of tickets sold between two numbers
 * @param {number} prevNum - Previous/starting ticket number
 * @param {number} currentNum - Current/ending ticket number
 * @param {number} bookSize - Total tickets in a book
 * @returns {number} - Number of tickets sold
 */
export function calculateSoldCount(prevNum, currentNum, bookSize) {
  // Handle SOLD book (-1)
  if (prevNum === -1) return 0; // Book already sold, no sales can happen
  
  // Handle invalid inputs
  if (isNaN(prevNum) || isNaN(bookSize)) return 0;
  if (isNaN(currentNum)) return 0; // If current number is blank/invalid, sold count is 0
  
  // Handle entire book sold
  if (currentNum === -1) return prevNum + 1;
  
  // No sales
  if (currentNum === prevNum) return 0;
  
  // Backward movement (unlikely but possible)
  if (currentNum < prevNum) return prevNum - currentNum;
  
  // Forward movement (normal case or new book started)
  // Formula: (remaining in current book) + (complete books sold)
  return (prevNum + 1) + ((bookSize - 1) - currentNum);
}

/**
 * Calculate total expected cash for a shift
 * @param {number} onlineSales - Online sales amount
 * @param {number} onlineCashes - Online cashes (negative)
 * @param {number} instantCashes - Instant cashes (negative)
 * @param {number} totalScratchSales - Total scratch-off sales
 * @returns {number} - Total expected cash
 */
export function calculateExpectedCash(onlineSales, onlineCashes, instantCashes, totalScratchSales) {
  return onlineSales - onlineCashes - instantCashes + totalScratchSales;
}

/**
 * Calculate difference between actual and expected cash
 * @param {number} actualCash - Actual cash collected
 * @param {number} expectedCash - Expected cash amount
 * @returns {number} - Difference (positive = surplus, negative = shortage)
 */
export function calculateDifference(actualCash, expectedCash) {
  return actualCash - expectedCash;
}

/**
 * Format difference as currency string with sign
 * @param {number} difference - Difference amount
 * @returns {string} - Formatted string like "$5.00" or "-$5.00"
 */
export function formatDifference(difference) {
  const sign = difference >= 0 ? '' : '-';
  return `${sign}$${Math.abs(difference).toFixed(2)}`;
}

