"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const user_schema_1 = require("../schemas/user.schema");
const domain_model_1 = require("../../../domain/models/domain-model");
describe('User Schema', () => {
    let userModel;
    let mongod;
    let module;
    beforeAll(async () => {
        mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        module = await testing_1.Test.createTestingModule({
            imports: [
                mongoose_2.MongooseModule.forRoot(uri),
                mongoose_2.MongooseModule.forFeature([{ name: user_schema_1.USER_MODEL, schema: user_schema_1.UserSchema }]),
            ],
        }).compile();
        userModel = module.get((0, mongoose_1.getModelToken)(user_schema_1.USER_MODEL));
    });
    afterAll(async () => {
        if (module) {
            await module.close();
        }
        if (mongod) {
            await mongod.stop();
        }
    });
    describe('Schema Methods', () => {
        let adminUser;
        let sellerUser;
        let buyerUser;
        beforeEach(async () => {
            adminUser = new userModel({
                email: 'admin@example.com',
                name: 'Admin User',
                passwordHash: 'hash123',
                role: domain_model_1.UserRole.ADMIN,
            });
            sellerUser = new userModel({
                email: 'seller@example.com',
                name: 'Seller User',
                passwordHash: 'hash123',
                role: domain_model_1.UserRole.SELLER,
            });
            buyerUser = new userModel({
                email: 'buyer@example.com',
                name: 'Buyer User',
                passwordHash: 'hash123',
                role: domain_model_1.UserRole.BUYER,
            });
            await adminUser.save();
            await sellerUser.save();
            await buyerUser.save();
        });
        afterEach(async () => {
            await userModel.deleteMany({});
        });
        describe('isAdmin', () => {
            it('should return true for admin users', () => {
                expect(adminUser.isAdmin()).toBe(true);
            });
            it('should return false for non-admin users', () => {
                expect(sellerUser.isAdmin()).toBe(false);
                expect(buyerUser.isAdmin()).toBe(false);
            });
        });
        describe('isSeller', () => {
            it('should return true for seller users', () => {
                expect(sellerUser.isSeller()).toBe(true);
            });
            it('should return false for non-seller users', () => {
                expect(adminUser.isSeller()).toBe(false);
                expect(buyerUser.isSeller()).toBe(false);
            });
        });
        describe('isBuyer', () => {
            it('should return true for buyer users', () => {
                expect(buyerUser.isBuyer()).toBe(true);
            });
            it('should return false for non-buyer users', () => {
                expect(adminUser.isBuyer()).toBe(false);
                expect(sellerUser.isBuyer()).toBe(false);
            });
        });
    });
    describe('Schema Indexes', () => {
        it('should have required indexes defined', async () => {
            const indexes = await userModel.collection.indexes();
            const indexMap = indexes.reduce((acc, index) => {
                const name = index.name;
                const keys = Object.keys(index.key);
                acc[name] = keys;
                return acc;
            }, {});
            expect(indexMap['_id_']).toBeDefined();
            expect(indexMap['email_1']).toBeDefined();
            expect(indexMap['role_1_createdAt_-1']).toBeDefined();
            const textIndexName = Object.keys(indexMap).find(name => indexMap[name].some((key) => key === '_fts' || key.includes('text')));
            expect(textIndexName).toBeDefined();
            if (textIndexName) {
                const textIndex = indexMap[textIndexName];
                expect(textIndex).toBeDefined();
                const hasTextIndex = textIndex.some((key) => key === '_fts' || key.includes('text'));
                expect(hasTextIndex).toBe(true);
            }
            expect(indexMap['email_1']).toContain('email');
            expect(indexMap['role_1_createdAt_-1']).toContain('role');
            expect(indexMap['role_1_createdAt_-1']).toContain('createdAt');
        });
        it('should be able to perform text search on name field', async () => {
            await new userModel({
                email: 'john@example.com',
                name: 'John Smith Developer',
                passwordHash: 'hash123',
                role: domain_model_1.UserRole.BUYER,
            }).save();
            await new userModel({
                email: 'jane@example.com',
                name: 'Jane Smith Manager',
                passwordHash: 'hash456',
                role: domain_model_1.UserRole.BUYER,
            }).save();
            await new userModel({
                email: 'bob@example.com',
                name: 'Bob Johnson Designer',
                passwordHash: 'hash789',
                role: domain_model_1.UserRole.BUYER,
            }).save();
            const results = await userModel.find({ $text: { $search: 'Smith' } }).exec();
            expect(results.length).toBe(2);
            const emails = results.map(user => user.email);
            expect(emails).toContain('john@example.com');
            expect(emails).toContain('jane@example.com');
            expect(emails).not.toContain('bob@example.com');
        });
    });
    describe('Schema Document Behavior', () => {
        it('should transform toJSON to exclude passwordHash', async () => {
            const user = new userModel({
                email: 'test@example.com',
                name: 'Test User',
                passwordHash: 'secrethash123',
                role: domain_model_1.UserRole.BUYER,
            });
            await user.save();
            const userJson = user.toJSON();
            expect(userJson).not.toHaveProperty('passwordHash');
            expect(userJson).toHaveProperty('email', 'test@example.com');
            expect(userJson).toHaveProperty('name', 'Test User');
            expect(userJson).toHaveProperty('role', domain_model_1.UserRole.BUYER);
        });
        it('should enforce unique email constraint', async () => {
            await new userModel({
                email: 'unique@example.com',
                name: 'First User',
                passwordHash: 'hash123',
                role: domain_model_1.UserRole.BUYER,
            }).save();
            const duplicateUser = new userModel({
                email: 'unique@example.com',
                name: 'Second User',
                passwordHash: 'hash456',
                role: domain_model_1.UserRole.BUYER,
            });
            await expect(duplicateUser.save()).rejects.toThrow();
        });
        it('should enforce required fields', async () => {
            const invalidUser = new userModel({
                name: 'Invalid User',
                passwordHash: 'hash123',
            });
            await expect(invalidUser.save()).rejects.toThrow();
        });
        it('should apply default values', async () => {
            const userWithDefaults = new userModel({
                email: 'defaults@example.com',
                name: 'Default User',
                passwordHash: 'hash123',
            });
            await userWithDefaults.save();
            expect(userWithDefaults.role).toBe(domain_model_1.UserRole.BUYER);
        });
    });
});
//# sourceMappingURL=user.schema.spec.js.map