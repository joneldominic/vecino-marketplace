"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSafe = void 0;
exports.validate = validate;
exports.formatZodError = formatZodError;
/**
 * Validate data against a Zod schema
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data or throws an error
 */
function validate(schema, data) {
    return schema.parse(data);
}
/**
 * Validate data against a Zod schema, returning null if validation fails
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data or null if validation fails
 */
const validateSafe = (schema, data) => {
    try {
        return schema.parse(data);
    }
    catch (_error) {
        return null;
    }
};
exports.validateSafe = validateSafe;
/**
 * Transform a Zod error into a human-readable error message
 * @param error Zod error
 * @returns Object with field-error mappings
 */
function formatZodError(error) {
    const errors = {};
    for (const issue of error.errors) {
        const path = issue.path.join('.');
        errors[path] = issue.message;
    }
    return errors;
}
//# sourceMappingURL=validation.js.map