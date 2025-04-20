import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Types } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

import { UserMongoDBRepository } from '../user-mongodb.repository';
import {
  User as _UserModel,
  USER_MODEL,
  UserSchema,
} from '../../../../database/mongodb/schemas/user.schema';
import { UserMapper } from '../../../mappers/user.mapper';
import { UserRole } from '../../../../domain/models/domain-model';

describe('UserMongoDBRepository Integration', () => {
  let repository: UserMongoDBRepository;
  let mapper: UserMapper;
  let connection: Connection;
  let mongod: MongoMemoryServer;
  let module: TestingModule;

  const testUser = {
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: 'hashedpassword123',
    role: UserRole.BUYER,
    phone: '123-456-7890',
  };

  beforeAll(async () => {
    // Create an in-memory MongoDB instance
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Set up the test module with a real MongoDB connection
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]),
      ],
      providers: [UserMongoDBRepository, UserMapper],
    }).compile();

    repository = module.get<UserMongoDBRepository>(UserMongoDBRepository);
    mapper = module.get<UserMapper>(UserMapper);
    connection = module.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    // Clean up resources
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
    // Clear the collection before each test
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
      // Create a user
      const createdUser = await repository.create(testUser);
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.email).toEqual(testUser.email);
      expect(createdUser.name).toEqual(testUser.name);
      expect(createdUser.role).toEqual(testUser.role);

      // Find the user by ID
      const foundUser = await repository.findById(createdUser.id);
      expect(foundUser).not.toBeNull();
      // Using non-null assertion operator since we've checked it's not null
      expect(foundUser!.id).toEqual(createdUser.id);
      expect(foundUser!.email).toEqual(testUser.email);
    });

    it('should find a user by email', async () => {
      // Create a user
      const createdUser = await repository.create(testUser);
      expect(createdUser).toBeDefined();

      // Find the user by email
      const foundUser = await repository.findByEmail(testUser.email);
      expect(foundUser).not.toBeNull();
      expect(foundUser!.id).toEqual(createdUser.id);
      expect(foundUser!.email).toEqual(testUser.email);
    });

    it('should find users by role', async () => {
      // Create multiple users with different roles
      await repository.create(testUser);
      await repository.create({
        ...testUser,
        email: 'seller@example.com',
        role: UserRole.SELLER,
      });
      await repository.create({
        ...testUser,
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      });
      await repository.create({
        ...testUser,
        email: 'buyer2@example.com',
        role: UserRole.BUYER,
      });

      // Find users by role
      const buyers = await repository.findByRole(UserRole.BUYER);
      expect(buyers).toBeDefined();
      expect(buyers.length).toEqual(2);
      expect(buyers[0].role).toEqual(UserRole.BUYER);
      expect(buyers[1].role).toEqual(UserRole.BUYER);

      // Test with pagination
      const paginatedBuyers = await repository.findByRole(UserRole.BUYER, { limit: 1 });
      expect(paginatedBuyers).toBeDefined();
      expect(paginatedBuyers.length).toEqual(1);

      const sellers = await repository.findByRole(UserRole.SELLER);
      expect(sellers).toBeDefined();
      expect(sellers.length).toEqual(1);
      expect(sellers[0].role).toEqual(UserRole.SELLER);
      expect(sellers[0].email).toEqual('seller@example.com');
    });

    it('should update a user', async () => {
      // Create a user
      const createdUser = await repository.create(testUser);
      expect(createdUser).toBeDefined();

      // Update the user
      const updateData = {
        name: 'Updated User Name',
        phone: '987-654-3210',
      };
      const updatedUser = await repository.update(createdUser.id, updateData);
      expect(updatedUser).not.toBeNull();
      expect(updatedUser!.id).toEqual(createdUser.id);
      expect(updatedUser!.name).toEqual(updateData.name);
      expect(updatedUser!.phone).toEqual(updateData.phone);
      expect(updatedUser!.email).toEqual(testUser.email); // unchanged fields remain the same
    });

    it('should update a user password', async () => {
      // Create a user
      const createdUser = await repository.create(testUser);
      expect(createdUser).toBeDefined();
      expect(createdUser.passwordHash).toBeDefined();

      // Need to fetch the user with password field explicitly selected
      // since the schema might hide it by default
      const mongoId = new Types.ObjectId(createdUser.id);
      const userBeforeUpdate = await connection.db.collection('users').findOne({ _id: mongoId });
      expect(userBeforeUpdate).toBeDefined();
      expect(userBeforeUpdate?.passwordHash).toEqual(testUser.passwordHash);

      // Update the user's password
      const newPasswordHash = 'newhash456';
      const updatedUser = await repository.updatePassword(createdUser.id, newPasswordHash);
      expect(updatedUser).not.toBeNull();
      expect(updatedUser!.id).toEqual(createdUser.id);

      // Verify directly in the database that the password was updated
      const userAfterUpdate = await connection.db.collection('users').findOne({ _id: mongoId });
      expect(userAfterUpdate).toBeDefined();
      expect(userAfterUpdate?.passwordHash).toEqual(newPasswordHash);
    });

    it('should delete a user', async () => {
      // Create a user
      const createdUser = await repository.create(testUser);
      expect(createdUser).toBeDefined();

      // Delete the user
      const deletedUser = await repository.delete(createdUser.id);
      expect(deletedUser).not.toBeNull();
      expect(deletedUser!.id).toEqual(createdUser.id);

      // Verify user no longer exists
      const foundUser = await repository.findById(createdUser.id);
      expect(foundUser).toBeNull();
    });

    it('should delete multiple users by criteria', async () => {
      // Create multiple users with same role
      await repository.create(testUser);
      await repository.create({
        ...testUser,
        email: 'buyer2@example.com',
      });
      await repository.create({
        ...testUser,
        email: 'seller@example.com',
        role: UserRole.SELLER,
      });

      // Find all users to confirm count
      const allUsers = await repository.findAll();
      expect(allUsers.length).toEqual(3);

      // Delete users with buyer role
      const deletedCount = await repository.deleteMany({ role: UserRole.BUYER });
      expect(deletedCount).toEqual(2);

      // Verify only non-buyers remain
      const remainingUsers = await repository.findAll();
      expect(remainingUsers.length).toEqual(1);
      expect(remainingUsers[0].role).toEqual(UserRole.SELLER);
    });
  });

  describe('Query Operations', () => {
    it('should find users with criteria and pagination', async () => {
      // Create multiple users
      for (let i = 0; i < 10; i++) {
        await repository.create({
          ...testUser,
          email: `user${i}@example.com`,
          name: `User ${i}`,
        });
      }

      // Test pagination
      const page1 = await repository.findAll({ skip: 0, limit: 3 });
      expect(page1.length).toEqual(3);

      const page2 = await repository.findAll({ skip: 3, limit: 3 });
      expect(page2.length).toEqual(3);

      // Check that the pages have the correct users and don't overlap
      const page1Ids = page1.map(u => u.id);
      const page2Ids = page2.map(u => u.id);

      // No IDs should appear in both pages
      const overlap = page1Ids.filter(id => page2Ids.includes(id));
      expect(overlap.length).toEqual(0);
    });

    it('should count users correctly', async () => {
      // Create users with different roles
      await repository.create(testUser);
      await repository.create({
        ...testUser,
        email: 'buyer2@example.com',
      });
      await repository.create({
        ...testUser,
        email: 'seller@example.com',
        role: UserRole.SELLER,
      });

      // Count all users
      const totalCount = await repository.count();
      expect(totalCount).toEqual(3);

      // Count users with buyer role
      const buyerCount = await repository.count({ role: UserRole.BUYER });
      expect(buyerCount).toEqual(2);

      // Count users with seller role
      const sellerCount = await repository.count({ role: UserRole.SELLER });
      expect(sellerCount).toEqual(1);

      // Count users with admin role (should be 0)
      const adminCount = await repository.count({ role: UserRole.ADMIN });
      expect(adminCount).toEqual(0);
    });

    it('should find users by custom criteria', async () => {
      // Create users with different properties
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
        phone: '555-1234', // same phone as user2
      });

      // Find by name
      const usersByName = await repository.findBy({ name: 'Special Name' });
      expect(usersByName.length).toEqual(1);
      expect(usersByName[0].email).toEqual('user2@example.com');

      // Find by phone
      const usersByPhone = await repository.findBy({ phone: '555-1234' });
      expect(usersByPhone.length).toEqual(2);
    });
  });
});
