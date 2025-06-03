const { StringCalculator } = require('../src/StringCalculator.js');

describe('StringCalculator - Optimized Node.js Version', () => {
  let calculator;

  beforeEach(() => {
    calculator = new StringCalculator();
  });

  describe('Basic functionality', () => {
    test('should return 0 for empty string', () => {
      expect(calculator.calculate('')).toBe(0);
    });

    test('should return 0 for null/undefined input', () => {
      expect(calculator.calculate()).toBe(0);
    });

    test('should return the number for single number input', () => {
      expect(calculator.calculate('1')).toBe(1);
      expect(calculator.calculate('42')).toBe(42);
    });

    test('should return sum of two numbers', () => {
      expect(calculator.calculate('1,2')).toBe(3);
    });

    test('should return sum of multiple numbers', () => {
      expect(calculator.calculate('1,2,3,4,5')).toBe(15);
    });
  });

  describe('Delimiter handling', () => {
    test('should handle newlines as delimiters', () => {
      expect(calculator.calculate('1\n2,3')).toBe(6);
    });

    test('should handle custom delimiters', () => {
      expect(calculator.calculate('//;\n1;2;3')).toBe(6);
    });

    test('should handle special character delimiters', () => {
      expect(calculator.calculate('//|\n1|2|3')).toBe(6);
    });

    test('should handle regex special characters as delimiters', () => {
      expect(calculator.calculate('//.\n1.2.3')).toBe(6);
      expect(calculator.calculate('//+\n1+2+3')).toBe(6);
    });
  });

  describe('Whitespace and edge cases', () => {
    test('should handle numbers with whitespace', () => {
      expect(calculator.calculate(' 1 , 2 , 3 ')).toBe(6);
    });

    test('should ignore empty values from extra delimiters', () => {
      expect(calculator.calculate('1,,2,3')).toBe(6);
      expect(calculator.calculate('1,,,2,,,3')).toBe(6);
    });

    test('should handle invalid numbers as 0', () => {
      expect(calculator.calculate('1,abc,3')).toBe(4);
    });
  });

  describe('Negative number validation', () => {
    test('should throw error for single negative number', () => {
      expect(() => calculator.calculate('1,-2,3'))
        .toThrow('Negative numbers not allowed: -2');
    });

    test('should throw error listing all negative numbers', () => {
      expect(() => calculator.calculate('1,-2,-3,4'))
        .toThrow('Negative numbers not allowed: -2, -3');
    });

    test('should throw error for single negative number input', () => {
      expect(() => calculator.calculate('-5'))
        .toThrow('Negative numbers not allowed: -5');
    });
  });

  describe('Operations', () => {
    test('should support multiplication with * delimiter', () => {
      expect(calculator.calculate('//*\n2*3*4')).toBe(24);
    });

    test('should support addition with + delimiter', () => {
      expect(calculator.calculate('//+\n1+2+3')).toBe(6);
    });

    test('should default to addition for unknown delimiters', () => {
      expect(calculator.calculate('//;\n1;2;3')).toBe(6);
    });

    test('should handle multiplication with zero', () => {
      expect(calculator.calculate('//*\n2*0*4')).toBe(0);
    });
  });

  describe('Performance and batch operations', () => {
    test('should handle large numbers efficiently', () => {
      const largeInput = Array.from({ length: 1000 }, (_, i) => i + 1).join(',');
      const result = calculator.calculate(largeInput);
      expect(result).toBe(500500); // Sum of 1 to 1000
    });

    test('should support batch calculations', () => {
      const inputs = ['1,2', '3,4', '5,6'];
      const results = calculator.batchCalculate(inputs);
      expect(results).toEqual([3, 7, 11]);
    });
    
    test('should handle empty batch', () => {
      expect(calculator.batchCalculate([])).toEqual([]);
    });
  });

  describe('Error handling', () => {
    test('should throw error for invalid delimiter format', () => {
      expect(() => calculator.calculate('//;'))
        .toThrow('Invalid delimiter format: missing newline after delimiter declaration');
    });
  });

  describe('Compatibility with original implementation', () => {
    test('should match all original test cases', () => {
      // All original test cases should pass
      expect(calculator.calculate('')).toBe(0);
      expect(calculator.calculate('1')).toBe(1);
      expect(calculator.calculate('1,2')).toBe(3);
      expect(calculator.calculate('1,2,3,4,5')).toBe(15);
      expect(calculator.calculate(' 1 , 2 , 3 ')).toBe(6);
      expect(calculator.calculate('1,,2,3')).toBe(6);
      expect(calculator.calculate('1\n2,3')).toBe(6);
      expect(calculator.calculate('//;\n1;2;3')).toBe(6);
      expect(() => calculator.calculate('1,-2,3')).toThrow('Negative numbers not allowed: -2');
      expect(() => calculator.calculate('1,-2,-3,4')).toThrow('Negative numbers not allowed: -2, -3');
      expect(calculator.calculate('//*\n1*2*4')).toBe(8);
    });
  });
});
