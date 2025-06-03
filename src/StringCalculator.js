const {
  detectOperation,
  extractDelimiter,
  splitNumbers,
  validateNoNegatives,
  calculationFunctions
} = require('./helpers/stringCalculatorHelper.js');

class StringCalculator {

  calculate(input) {
    if (!input || input.length === 0) {
      return 0;
    }

    if (!input.includes(',') && !input.includes('\n') && !input.startsWith('//')) {
      const num = parseInt(input.trim(), 10);
      if (isNaN(num)) return 0;
      if (num < 0) {
        throw new Error(`Negative numbers not allowed: ${num}`);
      }
      return num;
    }

    const { rawDelimiter, delimiter, numbersSection } = extractDelimiter(input);

    const operation = detectOperation(rawDelimiter);

    const numbers = splitNumbers(numbersSection, delimiter);

    validateNoNegatives(numbers);
    
    return calculationFunctions[operation](numbers);
  }

  batchCalculate(inputs) {
    return inputs.map(input => this.calculate(input));
  }
}

module.exports = {
  StringCalculator,
  default: new StringCalculator()
};
