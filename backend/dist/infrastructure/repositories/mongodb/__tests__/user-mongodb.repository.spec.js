"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_mongodb_repository_1 = require("../user-mongodb.repository");
const user_schema_1 = require("../../../../database/mongodb/schemas/user.schema");
const user_mapper_1 = require("../../../mappers/user.mapper");
const domain_model_1 = require("../../../../domain/models/domain-model");
describe('UserMongoDBRepository', () => {
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
                        create: jest.fn(),
                        exec: jest.fn(),
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
    it('should be defined', () => {
        expect(repository).toBeDefined();
    });
    describe('findByEmail', () => {
        it('should find a user by email and return a domain entity', async () => {
            const findOneSpy = jest.spyOn(model, 'findOne').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(mockUser),
            });
            const result = await repository.findByEmail('test@example.com');
            expect(findOneSpy).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(mapper.toDomain).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual(mockUserEntity);
        });
        it('should return null when user is not found', async () => {
            jest.spyOn(model, 'findOne').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(null),
            });
            const result = await repository.findByEmail('nonexistent@example.com');
            expect(result).toBeNull();
        });
    });
    describe('findByRole', () => {
        it('should find users by role with pagination', async () => {
            const mockUsers = [mockUser, { ...mockUser, email: 'user2@example.com' }];
            const findSpy = jest.spyOn(model, 'find').mockReturnValueOnce({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValueOnce(mockUsers),
            });
            const result = await repository.findByRole(domain_model_1.UserRole.BUYER, { skip: 0, limit: 10 });
            expect(findSpy).toHaveBeenCalledWith({ role: domain_model_1.UserRole.BUYER });
            expect(mapper.toDomain).toHaveBeenCalledTimes(2);
            expect(result.length).toBe(2);
        });
    });
    describe('updatePassword', () => {
        it('should update a user password and return the updated entity', async () => {
            const userId = mockUser._id.toString();
            const newPasswordHash = 'newhashedpassword123';
            const updatedUser = { ...mockUser, passwordHash: newPasswordHash };
            jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(updatedUser),
            });
            const result = await repository.updatePassword(userId, newPasswordHash);
            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(userId, { passwordHash: newPasswordHash }, { new: true });
            expect(mapper.toDomain).toHaveBeenCalledWith(updatedUser);
            expect(result).toEqual(mockUserEntity);
        });
        it('should return null when user is not found', async () => {
            jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(null),
            });
            const result = await repository.updatePassword('nonexistentid', 'newpassword');
            expect(result).toBeNull();
        });
    });
});
//# sourceMappingURL=user-mongodb.repository.spec.js.map