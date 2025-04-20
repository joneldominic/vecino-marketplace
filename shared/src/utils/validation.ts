import { z } from 'zod';

/**
 * Validate data against a Zod schema
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data or throws an error
 */
export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Validate data against a Zod schema, returning null if validation fails
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data or null if validation fails
 */
export function validateSafe<T>(schema: z.ZodType<T>, data: unknown): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    return null;
  }
}

/**
 * Transform a Zod error into a human-readable error message
 * @param error Zod error
 * @returns Object with field-error mappings
 */
export function formatZodError(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  for (const issue of error.errors) {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  }
  
  return errors;
} 