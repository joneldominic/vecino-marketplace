import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserMongoDBRepository } from '../user-mongodb.repository';
import { User as UserModel, USER_MODEL } from '../../../../database/mongodb/schemas/user.schema';
import { UserMapper } from '../../../mappers/user.mapper';
import { User as UserEntity, UserRole } from '../../../../domain/models/domain-model';

describe('UserMongoDBRepository', () => {
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
            create: jest.fn(),
            exec: jest.fn(),
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

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user by email and return a domain entity', async () => {
      const findOneSpy = jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await repository.findByEmail('test@example.com');

      expect(findOneSpy).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mapper.toDomain).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUserEntity);
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

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
      } as any);

      const result = await repository.findByRole(UserRole.BUYER, { skip: 0, limit: 10 });

      expect(findSpy).toHaveBeenCalledWith({ role: UserRole.BUYER });
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
      } as any);

      const result = await repository.updatePassword(userId, newPasswordHash);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { passwordHash: newPasswordHash },
        { new: true },
      );
      expect(mapper.toDomain).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(mockUserEntity);
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const result = await repository.updatePassword('nonexistentid', 'newpassword');

      expect(result).toBeNull();
    });
  });
});
