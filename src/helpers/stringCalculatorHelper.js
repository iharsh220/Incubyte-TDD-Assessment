const { Operation, OperationSymbols } = require('../enums/operations.js');

const delimiterCache = new Map();

function detectOperation(delimiter) {
  return OperationSymbols[delimiter] || OperationSymbols.default;
}

function extractDelimiter(input) {
  if (!input.startsWith('//')) {
    return {
      rawDelimiter: ',',
      delimiter: /[,\n]/,
      numbersSection: input
    };
  }

  const newlineIndex = input.indexOf('\n');

  if (newlineIndex === -1) {
    throw new Error('Invalid delimiter format: missing newline after delimiter declaration');
  }

  const rawDelimiter = input.slice(2, newlineIndex);
  const numbersSection = input.slice(newlineIndex + 1);

  let delimiter = delimiterCache.get(rawDelimiter);

  if (!delimiter) {
    const escapedDelimiter = rawDelimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    delimiter = new RegExp(escapedDelimiter, 'g');
    delimiterCache.set(rawDelimiter, delimiter);
  }

  return { rawDelimiter, delimiter, numbersSection };

}

function splitNumbers(numbers, delimiter) {

  if (!numbers) return [];

  return numbers
    .split(delimiter)
    .map(str => str.trim())
    .filter(str => str !== '')
    .map(str => {
      const num = parseInt(str, 10);
      return isNaN(num) ? 0 : num;
    });

}

function validateNoNegatives(numbers) {

  const negatives = numbers.filter(num => num < 0);
  if (negatives.length > 0) {
    throw new Error(`Negative numbers not allowed: ${negatives.join(', ')}`);
  }

}

const calculationFunctions = Object.freeze({
  [Operation.ADDITION]: (numbers) => {
    return numbers.reduce((sum, num) => sum + num, 0);
  },

  [Operation.MULTIPLICATION]: (numbers) => {
    if (numbers.length === 0) return 0;
    if (numbers.includes(0)) return 0;
    return numbers.reduce((product, num) => product * num, 1);
  }
});

module.exports = {
  detectOperation,
  extractDelimiter,
  splitNumbers,
  validateNoNegatives,
  calculationFunctions
};
