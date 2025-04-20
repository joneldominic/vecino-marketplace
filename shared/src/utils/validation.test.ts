import { z } from 'zod';
import { validate, validateSafe, formatZodError } from './validation';

describe('validation utils', () => {
  const TestSchema = z.object({
    name: z.string().min(2),
    age: z.number().positive(),
    email: z.string().email(),
  });

  describe('validate', () => {
    it('should return validated data when valid', () => {
      const validData = {
        name: 'John',
        age: 25,
        email: 'john@example.com',
      };

      const result = validate(TestSchema, validData);
      expect(result).toEqual(validData);
    });

    it('should throw an error when data is invalid', () => {
      const invalidData = {
        name: 'J', // too short
        age: -5, // not positive
        email: 'not-an-email', // invalid email
      };

      expect(() => validate(TestSchema, invalidData)).toThrow();
    });
  });

  describe('validateSafe', () => {
    it('should return validated data when valid', () => {
      const validData = {
        name: 'John',
        age: 25,
        email: 'john@example.com',
      };

      const result = validateSafe(TestSchema, validData);
      expect(result).toEqual(validData);
    });

    it('should return null when data is invalid', () => {
      const invalidData = {
        name: 'J', // too short
        age: -5, // not positive
        email: 'not-an-email', // invalid email
      };

      const result = validateSafe(TestSchema, invalidData);
      expect(result).toBeNull();
    });
  });

  describe('formatZodError', () => {
    it('should format Zod errors into a field-error mapping', () => {
      const invalidData = {
        name: 'J', // too short
        age: -5, // not positive
        email: 'not-an-email', // invalid email
      };

      try {
        TestSchema.parse(invalidData);
      } catch (error) {
        const formattedErrors = formatZodError(error as z.ZodError);

        expect(formattedErrors).toHaveProperty('name');
        expect(formattedErrors).toHaveProperty('age');
        expect(formattedErrors).toHaveProperty('email');
        expect(Object.keys(formattedErrors).length).toBe(3);
      }
    });
  });
});
