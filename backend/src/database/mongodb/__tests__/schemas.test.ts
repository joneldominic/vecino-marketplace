import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  User,
  UserSchema,
  Category,
  CategorySchema,
  Product,
  ProductSchema,
  Order,
  OrderSchema,
} from '../schemas';
import {
  UserRole,
  ProductStatus,
  ProductCondition,
  OrderStatus,
} from '../../../domain/models/domain-model';

// Increase the timeout for MongoDB operations
jest.setTimeout(30000);

// Helper function to safely delete a model
const safeDeleteModel = (modelName: string) => {
  try {
    if (mongoose.modelNames().includes(modelName)) {
      mongoose.deleteModel(modelName);
    }
  } catch (error) {
    console.error(`Error deleting model ${modelName}:`, error);
  }
};

describe('MongoDB Schemas', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('User Schema', () => {
    let UserModel: mongoose.Model<User>;

    beforeEach(() => {
      // Clean up any existing models first
      safeDeleteModel('User');
      UserModel = mongoose.model<User>('User', UserSchema);
    });

    afterEach(async () => {
      await mongoose.connection.dropCollection('users').catch(() => {});
      safeDeleteModel('User');
    });

    it('should create a valid user document', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashedpassword',
        role: UserRole.BUYER,
      };

      const user = new UserModel(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.passwordHash).toBe(userData.passwordHash);
      expect(savedUser.role).toBe(userData.role);
      // @ts-expect-error - createdAt is added by Mongoose at runtime
      expect(savedUser.createdAt).toBeInstanceOf(Date);
      // @ts-expect-error - updatedAt is added by Mongoose at runtime
      expect(savedUser.updatedAt).toBeInstanceOf(Date);
    });

    it('should fail when required fields are missing', async () => {
      const userData = {
        name: 'Test User',
        role: UserRole.BUYER,
      };

      const user = new UserModel(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should check user role with helper methods', async () => {
      const userData = {
        email: 'admin@example.com',
        name: 'Admin User',
        passwordHash: 'hashedpassword',
        role: UserRole.ADMIN,
      };

      const user = new UserModel(userData);
      await user.save();

      // @ts-expect-error - These methods exist at runtime from schema methods
      expect(user.isAdmin()).toBe(true);
      // @ts-expect-error - These methods exist at runtime from schema methods
      expect(user.isSeller()).toBe(false);
      // @ts-expect-error - These methods exist at runtime from schema methods
      expect(user.isBuyer()).toBe(false);
    });
  });

  describe('Product Schema', () => {
    let ProductModel: mongoose.Model<Product>;
    let UserModel: mongoose.Model<User>;
    let CategoryModel: mongoose.Model<Category>;
    let sellerId: string;
    let categoryId: string;

    beforeEach(async () => {
      // Clean up any existing models first
      safeDeleteModel('User');
      safeDeleteModel('Category');
      safeDeleteModel('Product');

      UserModel = mongoose.model<User>('User', UserSchema);
      CategoryModel = mongoose.model<Category>('Category', CategorySchema);
      ProductModel = mongoose.model<Product>('Product', ProductSchema);

      // Create a seller and category for reference
      const seller = new UserModel({
        email: 'seller@example.com',
        name: 'Seller',
        passwordHash: 'hashedpassword',
        role: UserRole.SELLER,
      });

      const category = new CategoryModel({
        name: 'Electronics',
        description: 'Electronic devices and accessories',
      });

      const savedSeller = await seller.save();
      const savedCategory = await category.save();

      sellerId = savedSeller._id.toString();
      categoryId = savedCategory._id.toString();
    });

    afterEach(async () => {
      await mongoose.connection.dropCollection('products').catch(() => {});
      await mongoose.connection.dropCollection('users').catch(() => {});
      await mongoose.connection.dropCollection('categories').catch(() => {});
      safeDeleteModel('Product');
      safeDeleteModel('User');
      safeDeleteModel('Category');
    });

    it('should create a valid product document', async () => {
      const productData = {
        title: 'Test Product',
        description: 'A test product description',
        price: { amount: 99.99, currency: 'PHP' },
        sellerId,
        categoryId,
        status: ProductStatus.ACTIVE,
        condition: ProductCondition.NEW,
        images: [{ url: 'http://example.com/image.jpg', isPrimary: true }],
      };

      const product = new ProductModel(productData);
      const savedProduct = await product.save();

      expect(savedProduct._id).toBeDefined();
      expect(savedProduct.title).toBe(productData.title);
      expect(savedProduct.description).toBe(productData.description);
      expect(savedProduct.price.amount).toBe(productData.price.amount);
      expect(savedProduct.price.currency).toBe(productData.price.currency);
      expect(savedProduct.sellerId.toString()).toBe(sellerId);
      expect(savedProduct.categoryId.toString()).toBe(categoryId);
      expect(savedProduct.status).toBe(productData.status);
      expect(savedProduct.condition).toBe(productData.condition);
      expect(savedProduct.images[0].url).toBe(productData.images[0].url);
      // @ts-expect-error - createdAt is added by Mongoose at runtime
      expect(savedProduct.createdAt).toBeInstanceOf(Date);
      // @ts-expect-error - updatedAt is added by Mongoose at runtime
      expect(savedProduct.updatedAt).toBeInstanceOf(Date);
      expect(savedProduct.images[0].isPrimary).toBe(true);
    });

    it('should check if product is available', async () => {
      const product = new ProductModel({
        title: 'Test Product',
        description: 'A test product description',
        price: { amount: 99.99, currency: 'PHP' },
        sellerId,
        categoryId,
        status: ProductStatus.ACTIVE,
        condition: ProductCondition.NEW,
        images: [{ url: 'http://example.com/image.jpg', isPrimary: true }],
      });

      await product.save();

      // @ts-expect-error - This method exists at runtime from schema methods
      expect(product.isAvailable()).toBe(true);

      product.status = ProductStatus.SOLD;

      // @ts-expect-error - This method exists at runtime from schema methods
      expect(product.isAvailable()).toBe(false);

      // Timestamps (added by Mongoose schema)
      // @ts-expect-error - createdAt is added by Mongoose at runtime
      expect(product.createdAt).toBeInstanceOf(Date);
      // @ts-expect-error - updatedAt is added by Mongoose at runtime
      expect(product.updatedAt).toBeInstanceOf(Date);
      // Check the isPrimary flag on the first image
      expect(product.images[0].isPrimary).toBe(true);
    });

    it('should get primary image', async () => {
      const product = new ProductModel({
        title: 'Test Product',
        description: 'A test product description',
        price: { amount: 99.99, currency: 'PHP' },
        sellerId,
        categoryId,
        status: ProductStatus.ACTIVE,
        condition: ProductCondition.NEW,
        images: [
          { url: 'http://example.com/image1.jpg', isPrimary: false },
          { url: 'http://example.com/image2.jpg', isPrimary: true },
        ],
      });

      await product.save();

      // @ts-expect-error - This method exists at runtime from schema methods
      const primaryImage = product.getPrimaryImage();
      expect(primaryImage).toBeDefined();
      expect(primaryImage?.url).toBe('http://example.com/image2.jpg');
    });
  });

  describe('Order Schema', () => {
    let OrderModel: mongoose.Model<Order>;
    let UserModel: mongoose.Model<User>;
    let buyerId: string;
    let sellerId: string;

    beforeEach(async () => {
      // Clean up any existing models first
      safeDeleteModel('User');
      safeDeleteModel('Order');

      UserModel = mongoose.model<User>('User', UserSchema);
      OrderModel = mongoose.model<Order>('Order', OrderSchema);

      // Create buyer and seller for reference
      const buyer = new UserModel({
        email: 'buyer@example.com',
        name: 'Buyer',
        passwordHash: 'hashedpassword',
        role: UserRole.BUYER,
      });

      const seller = new UserModel({
        email: 'seller@example.com',
        name: 'Seller',
        passwordHash: 'hashedpassword',
        role: UserRole.SELLER,
      });

      const savedBuyer = await buyer.save();
      const savedSeller = await seller.save();

      buyerId = savedBuyer._id.toString();
      sellerId = savedSeller._id.toString();
    });

    afterEach(async () => {
      await mongoose.connection.dropCollection('orders').catch(() => {});
      await mongoose.connection.dropCollection('users').catch(() => {});
      safeDeleteModel('Order');
      safeDeleteModel('User');
    });

    it('should create a valid order document', async () => {
      const orderData = {
        buyerId,
        sellerId,
        status: OrderStatus.CREATED,
        items: [
          {
            productId: new mongoose.Types.ObjectId().toString(),
            orderId: new mongoose.Types.ObjectId().toString(),
            productSnapshot: { title: 'Test Product' },
            quantity: 1,
            unitPrice: { amount: 99.99, currency: 'PHP' },
            totalPrice: { amount: 99.99, currency: 'PHP' },
          },
        ],
        subtotal: { amount: 99.99, currency: 'PHP' },
        tax: { amount: 8.0, currency: 'PHP' },
        total: { amount: 107.99, currency: 'PHP' },
        shippingAddress: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
          country: 'USA',
        },
      };

      const order = new OrderModel(orderData);
      const savedOrder = await order.save();

      expect(savedOrder._id).toBeDefined();
      expect(savedOrder.buyerId.toString()).toBe(buyerId);
      expect(savedOrder.sellerId.toString()).toBe(sellerId);
      expect(savedOrder.status).toBe(orderData.status);
      expect(savedOrder.items.length).toBe(1);
      expect(savedOrder.items[0].quantity).toBe(orderData.items[0].quantity);
      expect(savedOrder.subtotal.amount).toBe(orderData.subtotal.amount);
      expect(savedOrder.tax.amount).toBe(orderData.tax.amount);
      expect(savedOrder.total.amount).toBe(orderData.total.amount);
      expect(savedOrder.shippingAddress.street).toBe(orderData.shippingAddress.street);
      // @ts-expect-error - createdAt is added by Mongoose at runtime
      expect(savedOrder.createdAt).toBeInstanceOf(Date);
      // @ts-expect-error - updatedAt is added by Mongoose at runtime
      expect(savedOrder.updatedAt).toBeInstanceOf(Date);
    });

    it('should check order status permissions', async () => {
      const order = new OrderModel({
        buyerId,
        sellerId,
        status: OrderStatus.CREATED,
        items: [
          {
            productId: new mongoose.Types.ObjectId().toString(),
            orderId: new mongoose.Types.ObjectId().toString(),
            productSnapshot: { title: 'Test Product' },
            quantity: 1,
            unitPrice: { amount: 99.99, currency: 'PHP' },
            totalPrice: { amount: 99.99, currency: 'PHP' },
          },
        ],
        subtotal: { amount: 99.99, currency: 'PHP' },
        tax: { amount: 8.0, currency: 'PHP' },
        total: { amount: 107.99, currency: 'PHP' },
        shippingAddress: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
          country: 'USA',
        },
      });

      await order.save();

      // Test created status
      // @ts-expect-error - canBeCancelled is available at runtime
      expect(order.canBeCancelled()).toBe(true);
      // @ts-expect-error - canBeShipped is available at runtime
      expect(order.canBeShipped()).toBe(false);
      // @ts-expect-error - canBeDelivered is available at runtime
      expect(order.canBeDelivered()).toBe(false);
      // @ts-expect-error - canBeRefunded is available at runtime
      expect(order.canBeRefunded()).toBe(false);

      // Test paid status
      order.status = OrderStatus.PAID;
      // @ts-expect-error - canBeCancelled is available at runtime
      expect(order.canBeCancelled()).toBe(true);
      // @ts-expect-error - canBeShipped is available at runtime
      expect(order.canBeShipped()).toBe(true);
      // @ts-expect-error - canBeDelivered is available at runtime
      expect(order.canBeDelivered()).toBe(false);
      // @ts-expect-error - canBeRefunded is available at runtime
      expect(order.canBeRefunded()).toBe(true);

      // Test shipped status
      order.status = OrderStatus.SHIPPED;
      // @ts-expect-error - canBeCancelled is available at runtime
      expect(order.canBeCancelled()).toBe(false);
      // @ts-expect-error - canBeShipped is available at runtime
      expect(order.canBeShipped()).toBe(false);
      // @ts-expect-error - canBeDelivered is available at runtime
      expect(order.canBeDelivered()).toBe(true);
      // @ts-expect-error - canBeRefunded is available at runtime
      expect(order.canBeRefunded()).toBe(true);
    });
  });
});
