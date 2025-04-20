import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserMongoDBRepository } from '../user-mongodb.repository';
import { User as UserModel, USER_MODEL } from '../../../../database/mongodb/schemas/user.schema';
import { UserMapper } from '../../../mappers/user.mapper';
import { User as UserEntity, UserRole } from '../../../../domain/models/domain-model';

describe('BaseMongoDBRepository', () => {
  let repository: UserMongoDBRepository;
  let model: Model<UserModel>;
  let mapper: UserMapper;

  const mockUser = {
    _id: new Types.ObjectId(),
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: 'hashedpassword123',
    role: UserRole.BUYER,
    phone: '123-456-7890',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserEntity: UserEntity = {
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMongoDBRepository,
        UserMapper,
        {
          provide: getModelToken(USER_MODEL),
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

    repository = module.get<UserMongoDBRepository>(UserMongoDBRepository);
    model = module.get<Model<UserModel>>(getModelToken(USER_MODEL));
    mapper = module.get<UserMapper>(UserMapper);

    jest.spyOn(mapper, 'toDomain').mockReturnValue(mockUserEntity);
    jest.spyOn(mapper, 'toPersistence').mockReturnValue(mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find a user by ID and return domain entity', async () => {
      const userId = mockUser._id.toString();

      jest.spyOn(Types, 'ObjectId').mockImplementation(() => mockUser._id);

      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await repository.findById(userId);

      expect(model.findById).toHaveBeenCalled();
      expect(mapper.toDomain).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUserEntity);
    });

    it('should return null when user is not found', async () => {
      const validObjectId = '507f1f77bcf86cd799439011';

      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

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
      } as any);

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
      } as any);

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
      } as any);

      const criteria = { role: UserRole.BUYER };
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
      } as any);

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
      } as any);

      const result = await repository.count();

      expect(model.countDocuments).toHaveBeenCalledWith();
      expect(result).toBe(10);
    });

    it('should count documents matching criteria', async () => {
      jest.spyOn(model, 'countDocuments').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(5),
      } as any);

      const criteria = { role: UserRole.BUYER };
      const result = await repository.count(criteria);

      expect(model.countDocuments).toHaveBeenCalled();
      expect(mapper.toPersistence).toHaveBeenCalledWith(criteria);
      expect(result).toBe(5);
    });
  });

  describe('create', () => {
    it('should create a new user document', async () => {
      // Removed unused saveSpy variable

      jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockUser) as any);

      const newUserData = {
        email: 'new@example.com',
        name: 'New User',
        passwordHash: 'newhash123',
        role: UserRole.SELLER,
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
      } as any);

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
      } as any);

      const result = await repository.update(validObjectId, { name: 'Updated Name' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a user document by ID', async () => {
      const userId = mockUser._id.toString();

      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await repository.delete(userId);

      expect(model.findByIdAndDelete).toHaveBeenCalled();
      expect(mapper.toDomain).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUserEntity);
    });

    it('should return null when user to delete is not found', async () => {
      const validObjectId = '507f1f77bcf86cd799439011';

      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const result = await repository.delete(validObjectId);

      expect(result).toBeNull();
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple user documents by criteria', async () => {
      jest.spyOn(model, 'deleteMany').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 3 }),
      } as any);

      const criteria = { role: UserRole.BUYER };
      const result = await repository.deleteMany(criteria);

      expect(model.deleteMany).toHaveBeenCalled();
      expect(mapper.toPersistence).toHaveBeenCalledWith(criteria);
      expect(result).toBe(3);
    });
  });
});
