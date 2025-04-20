import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User, UserSchema, USER_MODEL } from '../schemas/user.schema';
import { UserRole } from '../../../domain/models/domain-model';

// Define interface with the instance methods
interface UserDocument extends User {
  isAdmin(): boolean;
  isSeller(): boolean;
  isBuyer(): boolean;
}

describe('User Schema', () => {
  let userModel: Model<User>;
  let mongod: MongoMemoryServer;
  let module: TestingModule;

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
    }).compile();

    userModel = module.get<Model<User>>(getModelToken(USER_MODEL));
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
    let adminUser: UserDocument;
    let sellerUser: UserDocument;
    let buyerUser: UserDocument;

    beforeEach(async () => {
      // Create test users for each role
      adminUser = new userModel({
        email: 'admin@example.com',
        name: 'Admin User',
        passwordHash: 'hash123',
        role: UserRole.ADMIN,
      }) as UserDocument;

      sellerUser = new userModel({
        email: 'seller@example.com',
        name: 'Seller User',
        passwordHash: 'hash123',
        role: UserRole.SELLER,
      }) as UserDocument;

      buyerUser = new userModel({
        email: 'buyer@example.com',
        name: 'Buyer User',
        passwordHash: 'hash123',
        role: UserRole.BUYER,
      }) as UserDocument;

      // Save the users
      await adminUser.save();
      await sellerUser.save();
      await buyerUser.save();
    });

    afterEach(async () => {
      // Clean up after each test
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

      // Convert to a more easily searchable format
      const indexMap = indexes.reduce(
        (acc, index) => {
          const name = index.name;
          const keys = Object.keys(index.key);
          acc[name] = keys;
          return acc;
        },
        {} as Record<string, string[]>,
      );

      // Check expected indexes
      expect(indexMap['_id_']).toBeDefined(); // Default _id index
      expect(indexMap['email_1']).toBeDefined(); // Email index
      expect(indexMap['role_1_createdAt_-1']).toBeDefined(); // Compound index

      // Find text index - the name might vary but should contain a text key
      const textIndexName = Object.keys(indexMap).find(name =>
        indexMap[name].some((key: string) => key === '_fts' || key.includes('text')),
      );

      expect(textIndexName).toBeDefined();
      if (textIndexName) {
        // Only check if textIndexName is defined to avoid TypeScript error
        const textIndex = indexMap[textIndexName];
        expect(textIndex).toBeDefined();

        // Text indexes will either have '_fts' or a field with 'text'
        const hasTextIndex = textIndex.some(
          (key: string) => key === '_fts' || key.includes('text'),
        );
        expect(hasTextIndex).toBe(true);
      }

      // Verify specific index compositions
      expect(indexMap['email_1']).toContain('email');
      expect(indexMap['role_1_createdAt_-1']).toContain('role');
      expect(indexMap['role_1_createdAt_-1']).toContain('createdAt');
    });

    it('should be able to perform text search on name field', async () => {
      // Create test users with different names
      await new userModel({
        email: 'john@example.com',
        name: 'John Smith Developer',
        passwordHash: 'hash123',
        role: UserRole.BUYER,
      }).save();

      await new userModel({
        email: 'jane@example.com',
        name: 'Jane Smith Manager',
        passwordHash: 'hash456',
        role: UserRole.BUYER,
      }).save();

      await new userModel({
        email: 'bob@example.com',
        name: 'Bob Johnson Designer',
        passwordHash: 'hash789',
        role: UserRole.BUYER,
      }).save();

      // Search using the text index on name field
      const results = await userModel.find({ $text: { $search: 'Smith' } }).exec();

      // Verify results contain the users with "Smith" in their name
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
        role: UserRole.BUYER,
      });

      await user.save();

      // Convert to JSON and verify passwordHash is excluded
      const userJson = user.toJSON();
      expect(userJson).not.toHaveProperty('passwordHash');
      expect(userJson).toHaveProperty('email', 'test@example.com');
      expect(userJson).toHaveProperty('name', 'Test User');
      expect(userJson).toHaveProperty('role', UserRole.BUYER);
    });

    it('should enforce unique email constraint', async () => {
      // Create a user with a specific email
      await new userModel({
        email: 'unique@example.com',
        name: 'First User',
        passwordHash: 'hash123',
        role: UserRole.BUYER,
      }).save();

      // Try to create another user with the same email
      const duplicateUser = new userModel({
        email: 'unique@example.com',
        name: 'Second User',
        passwordHash: 'hash456',
        role: UserRole.BUYER,
      });

      // Expect save to throw a duplicate key error
      await expect(duplicateUser.save()).rejects.toThrow();
    });

    it('should enforce required fields', async () => {
      // Missing required fields should cause validation errors
      const invalidUser = new userModel({
        // Missing required email
        name: 'Invalid User',
        passwordHash: 'hash123',
        // Missing required role, but has default
      });

      await expect(invalidUser.save()).rejects.toThrow();
    });

    it('should apply default values', async () => {
      // Create user without specifying role (should get default BUYER)
      const userWithDefaults = new userModel({
        email: 'defaults@example.com',
        name: 'Default User',
        passwordHash: 'hash123',
        // No role specified
      });

      await userWithDefaults.save();
      expect(userWithDefaults.role).toBe(UserRole.BUYER);
    });
  });
});
