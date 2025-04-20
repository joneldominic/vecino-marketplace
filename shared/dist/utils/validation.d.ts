import { z } from 'zod';
/**
 * Validate data against a Zod schema
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data or throws an error
 */
export declare function validate<T>(schema: z.ZodType<T>, data: unknown): T;
/**
 * Validate data against a Zod schema, returning null if validation fails
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data or null if validation fails
 */
export declare const validateSafe: <T>(schema: z.ZodType<T>, data: unknown) => T | null;
/**
 * Transform a Zod error into a human-readable error message
 * @param error Zod error
 * @returns Object with field-error mappings
 */
export declare function formatZodError(error: z.ZodError): Record<string, string>;
