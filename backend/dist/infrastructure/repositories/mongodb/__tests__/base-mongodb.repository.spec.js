"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_mongodb_repository_1 = require("../user-mongodb.repository");
const user_schema_1 = require("../../../../database/mongodb/schemas/user.schema");
const user_mapper_1 = require("../../../mappers/user.mapper");
const domain_model_1 = require("../../../../domain/models/domain-model");
describe('BaseMongoDBRepository', () => {
    let repository;
    let model;
    let mapper;
    const mockUser = {
        _id: new mongoose_2.Types.ObjectId(),
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashedpassword123',
        role: domain_model_1.UserRole.BUYER,
        phone: '123-456-7890',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const mockUserEntity = {
        id: mockUser._id.toString(),
        email: mockUser.email,
        name: mockUser.name,
        passwordHash: mockUser.passwordHash,
        role: mockUser.role,
        phone: mockUser.phone,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                user_mongodb_repository_1.UserMongoDBRepository,
                user_mapper_1.UserMapper,
                {
                    provide: (0, mongoose_1.getModelToken)(user_schema_1.USER_MODEL),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        findById: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn(),
                        deleteMany: jest.fn(),
                        countDocuments: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        exec: jest.fn(),
                        constructor: jest.fn().mockImplementation(() => ({
                            save: jest.fn().mockResolvedValue(mockUser),
                        })),
                    },
                },
            ],
        }).compile();
        repository = module.get(user_mongodb_repository_1.UserMongoDBRepository);
        model = module.get((0, mongoose_1.getModelToken)(user_schema_1.USER_MODEL));
        mapper = module.get(user_mapper_1.UserMapper);
        jest.spyOn(mapper, 'toDomain').mockReturnValue(mockUserEntity);
        jest.spyOn(mapper, 'toPersistence').mockReturnValue(mockUser);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('findById', () => {
        it('should find a user by ID and return domain entity', async () => {
            const userId = mockUser._id.toString();
            jest.spyOn(mongoose_2.Types, 'ObjectId').mockImplementation(() => mockUser._id);
            jest.spyOn(model, 'findById').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(mockUser),
            });
            const result = await repository.findById(userId);
            expect(model.findById).toHaveBeenCalled();
            expect(mapper.toDomain).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual(mockUserEntity);
        });
        it('should return null when user is not found', async () => {
            const validObjectId = '507f1f77bcf86cd799439011';
            jest.spyOn(model, 'findById').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(null),
            });
            const result = await repository.findById(validObjectId);
            expect(result).toBeNull();
        });
    });
    describe('findAll', () => {
        it('should find all users without pagination', async () => {
            const mockUsers = [mockUser, { ...mockUser, email: 'user2@example.com' }];
            const findSpy = jest.spyOn(model, 'find').mockReturnValueOnce({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValueOnce(mockUsers),
            });
            const result = await repository.findAll();
            expect(findSpy).toHaveBeenCalled();
            expect(mapper.toDomain).toHaveBeenCalledTimes(2);
            expect(result.length).toBe(2);
        });
        it('should find all users with pagination', async () => {
            const mockUsers = [mockUser];
            const skipSpy = jest.fn().mockReturnThis();
            const limitSpy = jest.fn().mockReturnThis();
            jest.spyOn(model, 'find').mockReturnValueOnce({
                skip: skipSpy,
                limit: limitSpy,
                exec: jest.fn().mockResolvedValueOnce(mockUsers),
            });
            const result = await repository.findAll({ skip: 10, limit: 5 });
            expect(skipSpy).toHaveBeenCalledWith(10);
            expect(limitSpy).toHaveBeenCalledWith(5);
            expect(mapper.toDomain).toHaveBeenCalledTimes(1);
            expect(result.length).toBe(1);
        });
    });
    describe('findBy', () => {
        it('should find users by criteria', async () => {
            const mockUsers = [mockUser];
            const skipSpy = jest.fn().mockReturnThis();
            const limitSpy = jest.fn().mockReturnThis();
            jest.spyOn(model, 'find').mockReturnValueOnce({
                skip: skipSpy,
                limit: limitSpy,
                exec: jest.fn().mockResolvedValueOnce(mockUsers),
            });
            const criteria = { role: domain_model_1.UserRole.BUYER };
            const result = await repository.findBy(criteria, { skip: 5, limit: 10 });
            expect(model.find).toHaveBeenCalled();
            expect(skipSpy).toHaveBeenCalledWith(5);
            expect(limitSpy).toHaveBeenCalledWith(10);
            expect(mapper.toPersistence).toHaveBeenCalledWith(criteria);
            expect(mapper.toDomain).toHaveBeenCalledWith(mockUser);
            expect(result.length).toBe(1);
        });
        it('should convert ID criteria correctly', async () => {
            const mockUsers = [mockUser];
            jest.spyOn(model, 'find').mockReturnValueOnce({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValueOnce(mockUsers),
            });
            const mockPersistenceData = { _id: mockUser._id };
            const customMapperSpy = jest
                .spyOn(mapper, 'toPersistence')
                .mockImplementationOnce(() => mockPersistenceData);
            const criteria = { id: mockUser._id.toString() };
            await repository.findBy(criteria);
            expect(model.find).toHaveBeenCalled();
            expect(customMapperSpy).toHaveBeenCalled();
        });
    });
    describe('count', () => {
        it('should count all documents when no criteria provided', async () => {
            jest.spyOn(model, 'countDocuments').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(10),
            });
            const result = await repository.count();
            expect(model.countDocuments).toHaveBeenCalledWith();
            expect(result).toBe(10);
        });
        it('should count documents matching criteria', async () => {
            jest.spyOn(model, 'countDocuments').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(5),
            });
            const criteria = { role: domain_model_1.UserRole.BUYER };
            const result = await repository.count(criteria);
            expect(model.countDocuments).toHaveBeenCalled();
            expect(mapper.toPersistence).toHaveBeenCalledWith(criteria);
            expect(result).toBe(5);
        });
    });
    describe('create', () => {
        it('should create a new user document', async () => {
            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockUser));
            const newUserData = {
                email: 'new@example.com',
                name: 'New User',
                passwordHash: 'newhash123',
                role: domain_model_1.UserRole.SELLER,
            };
            const result = await repository.create(newUserData);
            expect(mapper.toPersistence).toHaveBeenCalledWith(newUserData);
            expect(mapper.toDomain).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual(mockUserEntity);
        });
    });
    describe('update', () => {
        it('should update an existing user document', async () => {
            const userId = mockUser._id.toString();
            const updateData = { name: 'Updated Name' };
            jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(mockUser),
            });
            const result = await repository.update(userId, updateData);
            expect(model.findByIdAndUpdate).toHaveBeenCalled();
            expect(mapper.toPersistence).toHaveBeenCalledWith(updateData);
            expect(mapper.toDomain).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual(mockUserEntity);
        });
        it('should return null when user to update is not found', async () => {
            const validObjectId = '507f1f77bcf86cd799439011';
            jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(null),
            });
            const result = await repository.update(validObjectId, { name: 'Updated Name' });
            expect(result).toBeNull();
        });
    });
    describe('delete', () => {
        it('should delete a user document by ID', async () => {
            const userId = mockUser._id.toString();
            jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(mockUser),
            });
            const result = await repository.delete(userId);
            expect(model.findByIdAndDelete).toHaveBeenCalled();
            expect(mapper.toDomain).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual(mockUserEntity);
        });
        it('should return null when user to delete is not found', async () => {
            const validObjectId = '507f1f77bcf86cd799439011';
            jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(null),
            });
            const result = await repository.delete(validObjectId);
            expect(result).toBeNull();
        });
    });
    describe('deleteMany', () => {
        it('should delete multiple user documents by criteria', async () => {
            jest.spyOn(model, 'deleteMany').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce({ deletedCount: 3 }),
            });
            const criteria = { role: domain_model_1.UserRole.BUYER };
            const result = await repository.deleteMany(criteria);
            expect(model.deleteMany).toHaveBeenCalled();
            expect(mapper.toPersistence).toHaveBeenCalledWith(criteria);
            expect(result).toBe(3);
        });
    });
});
//# sourceMappingURL=base-mongodb.repository.spec.js.map