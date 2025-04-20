"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validation_1 = require("./validation");
describe('validation utils', () => {
    const TestSchema = zod_1.z.object({
        name: zod_1.z.string().min(2),
        age: zod_1.z.number().positive(),
        email: zod_1.z.string().email(),
    });
    describe('validate', () => {
        it('should return validated data when valid', () => {
            const validData = {
                name: 'John',
                age: 25,
                email: 'john@example.com',
            };
            const result = (0, validation_1.validate)(TestSchema, validData);
            expect(result).toEqual(validData);
        });
        it('should throw an error when data is invalid', () => {
            const invalidData = {
                name: 'J', // too short
                age: -5, // not positive
                email: 'not-an-email', // invalid email
            };
            expect(() => (0, validation_1.validate)(TestSchema, invalidData)).toThrow();
        });
    });
    describe('validateSafe', () => {
        it('should return validated data when valid', () => {
            const validData = {
                name: 'John',
                age: 25,
                email: 'john@example.com',
            };
            const result = (0, validation_1.validateSafe)(TestSchema, validData);
            expect(result).toEqual(validData);
        });
        it('should return null when data is invalid', () => {
            const invalidData = {
                name: 'J', // too short
                age: -5, // not positive
                email: 'not-an-email', // invalid email
            };
            const result = (0, validation_1.validateSafe)(TestSchema, invalidData);
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
            }
            catch (error) {
                const formattedErrors = (0, validation_1.formatZodError)(error);
                expect(formattedErrors).toHaveProperty('name');
                expect(formattedErrors).toHaveProperty('age');
                expect(formattedErrors).toHaveProperty('email');
                expect(Object.keys(formattedErrors).length).toBe(3);
            }
        });
    });
});
//# sourceMappingURL=validation.test.js.map