"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("@nestjs/mongoose");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_2 = require("mongoose");
const mongoose_3 = require("@nestjs/mongoose");
const user_mongodb_repository_1 = require("../user-mongodb.repository");
const user_schema_1 = require("../../../../database/mongodb/schemas/user.schema");
const user_mapper_1 = require("../../../mappers/user.mapper");
const domain_model_1 = require("../../../../domain/models/domain-model");
describe('UserMongoDBRepository Integration', () => {
    let repository;
    let mapper;
    let connection;
    let mongod;
    let module;
    const testUser = {
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashedpassword123',
        role: domain_model_1.UserRole.BUYER,
        phone: '123-456-7890',
    };
    beforeAll(async () => {
        mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        module = await testing_1.Test.createTestingModule({
            imports: [
                mongoose_1.MongooseModule.forRoot(uri),
                mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.USER_MODEL, schema: user_schema_1.UserSchema }]),
            ],
            providers: [user_mongodb_repository_1.UserMongoDBRepository, user_mapper_1.UserMapper],
        }).compile();
        repository = module.get(user_mongodb_repository_1.UserMongoDBRepository);
        mapper = module.get(user_mapper_1.UserMapper);
        connection = module.get((0, mongoose_3.getConnectionToken)());
    });
    afterAll(async () => {
        if (connection) {
            await connection.close();
        }
        if (mongod) {
            await mongod.stop();
        }
        if (module) {
            await module.close();
        }
    });
    beforeEach(async () => {
        if (connection) {
            const collections = await connection.db.collections();
            for (const collection of collections) {
                await collection.deleteMany({});
            }
        }
    });
    it('should be defined', () => {
        expect(repository).toBeDefined();
        expect(mapper).toBeDefined();
    });
    describe('CRUD Operations', () => {
        it('should create a user and find it by ID', async () => {
            const createdUser = await repository.create(testUser);
            expect(createdUser).toBeDefined();
            expect(createdUser.id).toBeDefined();
            expect(createdUser.email).toEqual(testUser.email);
            expect(createdUser.name).toEqual(testUser.name);
            expect(createdUser.role).toEqual(testUser.role);
            const foundUser = await repository.findById(createdUser.id);
            expect(foundUser).not.toBeNull();
            expect(foundUser.id).toEqual(createdUser.id);
            expect(foundUser.email).toEqual(testUser.email);
        });
        it('should find a user by email', async () => {
            const createdUser = await repository.create(testUser);
            expect(createdUser).toBeDefined();
            const foundUser = await repository.findByEmail(testUser.email);
            expect(foundUser).not.toBeNull();
            expect(foundUser.id).toEqual(createdUser.id);
            expect(foundUser.email).toEqual(testUser.email);
        });
        it('should find users by role', async () => {
            await repository.create(testUser);
            await repository.create({
                ...testUser,
                email: 'seller@example.com',
                role: domain_model_1.UserRole.SELLER,
            });
            await repository.create({
                ...testUser,
                email: 'admin@example.com',
                role: domain_model_1.UserRole.ADMIN,
            });
            await repository.create({
                ...testUser,
                email: 'buyer2@example.com',
                role: domain_model_1.UserRole.BUYER,
            });
            const buyers = await repository.findByRole(domain_model_1.UserRole.BUYER);
            expect(buyers).toBeDefined();
            expect(buyers.length).toEqual(2);
            expect(buyers[0].role).toEqual(domain_model_1.UserRole.BUYER);
            expect(buyers[1].role).toEqual(domain_model_1.UserRole.BUYER);
            const paginatedBuyers = await repository.findByRole(domain_model_1.UserRole.BUYER, { limit: 1 });
            expect(paginatedBuyers).toBeDefined();
            expect(paginatedBuyers.length).toEqual(1);
            const sellers = await repository.findByRole(domain_model_1.UserRole.SELLER);
            expect(sellers).toBeDefined();
            expect(sellers.length).toEqual(1);
            expect(sellers[0].role).toEqual(domain_model_1.UserRole.SELLER);
            expect(sellers[0].email).toEqual('seller@example.com');
        });
        it('should update a user', async () => {
            const createdUser = await repository.create(testUser);
            expect(createdUser).toBeDefined();
            const updateData = {
                name: 'Updated User Name',
                phone: '987-654-3210',
            };
            const updatedUser = await repository.update(createdUser.id, updateData);
            expect(updatedUser).not.toBeNull();
            expect(updatedUser.id).toEqual(createdUser.id);
            expect(updatedUser.name).toEqual(updateData.name);
            expect(updatedUser.phone).toEqual(updateData.phone);
            expect(updatedUser.email).toEqual(testUser.email);
        });
        it('should update a user password', async () => {
            const createdUser = await repository.create(testUser);
            expect(createdUser).toBeDefined();
            expect(createdUser.passwordHash).toBeDefined();
            const mongoId = new mongoose_2.Types.ObjectId(createdUser.id);
            const userBeforeUpdate = await connection.db.collection('users').findOne({ _id: mongoId });
            expect(userBeforeUpdate).toBeDefined();
            expect(userBeforeUpdate?.passwordHash).toEqual(testUser.passwordHash);
            const newPasswordHash = 'newhash456';
            const updatedUser = await repository.updatePassword(createdUser.id, newPasswordHash);
            expect(updatedUser).not.toBeNull();
            expect(updatedUser.id).toEqual(createdUser.id);
            const userAfterUpdate = await connection.db.collection('users').findOne({ _id: mongoId });
            expect(userAfterUpdate).toBeDefined();
            expect(userAfterUpdate?.passwordHash).toEqual(newPasswordHash);
        });
        it('should delete a user', async () => {
            const createdUser = await repository.create(testUser);
            expect(createdUser).toBeDefined();
            const deletedUser = await repository.delete(createdUser.id);
            expect(deletedUser).not.toBeNull();
            expect(deletedUser.id).toEqual(createdUser.id);
            const foundUser = await repository.findById(createdUser.id);
            expect(foundUser).toBeNull();
        });
        it('should delete multiple users by criteria', async () => {
            await repository.create(testUser);
            await repository.create({
                ...testUser,
                email: 'buyer2@example.com',
            });
            await repository.create({
                ...testUser,
                email: 'seller@example.com',
                role: domain_model_1.UserRole.SELLER,
            });
            const allUsers = await repository.findAll();
            expect(allUsers.length).toEqual(3);
            const deletedCount = await repository.deleteMany({ role: domain_model_1.UserRole.BUYER });
            expect(deletedCount).toEqual(2);
            const remainingUsers = await repository.findAll();
            expect(remainingUsers.length).toEqual(1);
            expect(remainingUsers[0].role).toEqual(domain_model_1.UserRole.SELLER);
        });
    });
    describe('Query Operations', () => {
        it('should find users with criteria and pagination', async () => {
            for (let i = 0; i < 10; i++) {
                await repository.create({
                    ...testUser,
                    email: `user${i}@example.com`,
                    name: `User ${i}`,
                });
            }
            const page1 = await repository.findAll({ skip: 0, limit: 3 });
            expect(page1.length).toEqual(3);
            const page2 = await repository.findAll({ skip: 3, limit: 3 });
            expect(page2.length).toEqual(3);
            const page1Ids = page1.map(u => u.id);
            const page2Ids = page2.map(u => u.id);
            const overlap = page1Ids.filter(id => page2Ids.includes(id));
            expect(overlap.length).toEqual(0);
        });
        it('should count users correctly', async () => {
            await repository.create(testUser);
            await repository.create({
                ...testUser,
                email: 'buyer2@example.com',
            });
            await repository.create({
                ...testUser,
                email: 'seller@example.com',
                role: domain_model_1.UserRole.SELLER,
            });
            const totalCount = await repository.count();
            expect(totalCount).toEqual(3);
            const buyerCount = await repository.count({ role: domain_model_1.UserRole.BUYER });
            expect(buyerCount).toEqual(2);
            const sellerCount = await repository.count({ role: domain_model_1.UserRole.SELLER });
            expect(sellerCount).toEqual(1);
            const adminCount = await repository.count({ role: domain_model_1.UserRole.ADMIN });
            expect(adminCount).toEqual(0);
        });
        it('should find users by custom criteria', async () => {
            await repository.create(testUser);
            await repository.create({
                ...testUser,
                email: 'user2@example.com',
                name: 'Special Name',
                phone: '555-1234',
            });
            await repository.create({
                ...testUser,
                email: 'user3@example.com',
                phone: '555-1234',
            });
            const usersByName = await repository.findBy({ name: 'Special Name' });
            expect(usersByName.length).toEqual(1);
            expect(usersByName[0].email).toEqual('user2@example.com');
            const usersByPhone = await repository.findBy({ phone: '555-1234' });
            expect(usersByPhone.length).toEqual(2);
        });
    });
});
//# sourceMappingURL=user-mongodb.repository.integration.spec.js.map