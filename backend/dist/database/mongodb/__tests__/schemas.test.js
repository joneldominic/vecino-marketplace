"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongoose = require("mongoose");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const schemas_1 = require("../schemas");
const domain_model_1 = require("../../../domain/models/domain-model");
jest.setTimeout(30000);
const safeDeleteModel = (modelName) => {
    try {
        if (mongoose.modelNames().includes(modelName)) {
            mongoose.deleteModel(modelName);
        }
    }
    catch (error) {
        console.error(`Error deleting model ${modelName}:`, error);
    }
};
(0, globals_1.describe)('MongoDB Schemas', () => {
    let mongoServer;
    (0, globals_1.beforeAll)(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });
    (0, globals_1.afterAll)(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });
    (0, globals_1.describe)('User Schema', () => {
        let UserModel;
        (0, globals_1.beforeEach)(() => {
            safeDeleteModel('User');
            UserModel = mongoose.model('User', schemas_1.UserSchema);
        });
        (0, globals_1.afterEach)(async () => {
            await mongoose.connection.dropCollection('users').catch(() => { });
            safeDeleteModel('User');
        });
        (0, globals_1.it)('should create a valid user document', async () => {
            const userData = {
                email: 'test@example.com',
                name: 'Test User',
                passwordHash: 'hashedpassword',
                role: domain_model_1.UserRole.BUYER,
            };
            const user = new UserModel(userData);
            const savedUser = await user.save();
            (0, globals_1.expect)(savedUser._id).toBeDefined();
            (0, globals_1.expect)(savedUser.email).toBe(userData.email);
            (0, globals_1.expect)(savedUser.name).toBe(userData.name);
            (0, globals_1.expect)(savedUser.passwordHash).toBe(userData.passwordHash);
            (0, globals_1.expect)(savedUser.role).toBe(userData.role);
            (0, globals_1.expect)(savedUser.createdAt).toBeInstanceOf(Date);
            (0, globals_1.expect)(savedUser.updatedAt).toBeInstanceOf(Date);
        });
        (0, globals_1.it)('should fail when required fields are missing', async () => {
            const userData = {
                name: 'Test User',
                role: domain_model_1.UserRole.BUYER,
            };
            const user = new UserModel(userData);
            await (0, globals_1.expect)(user.save()).rejects.toThrow();
        });
        (0, globals_1.it)('should check user role with helper methods', async () => {
            const userData = {
                email: 'admin@example.com',
                name: 'Admin User',
                passwordHash: 'hashedpassword',
                role: domain_model_1.UserRole.ADMIN,
            };
            const user = new UserModel(userData);
            await user.save();
            (0, globals_1.expect)(user.isAdmin()).toBe(true);
            (0, globals_1.expect)(user.isSeller()).toBe(false);
            (0, globals_1.expect)(user.isBuyer()).toBe(false);
        });
    });
    (0, globals_1.describe)('Product Schema', () => {
        let ProductModel;
        let UserModel;
        let CategoryModel;
        let sellerId;
        let categoryId;
        (0, globals_1.beforeEach)(async () => {
            safeDeleteModel('User');
            safeDeleteModel('Category');
            safeDeleteModel('Product');
            UserModel = mongoose.model('User', schemas_1.UserSchema);
            CategoryModel = mongoose.model('Category', schemas_1.CategorySchema);
            ProductModel = mongoose.model('Product', schemas_1.ProductSchema);
            const seller = new UserModel({
                email: 'seller@example.com',
                name: 'Seller',
                passwordHash: 'hashedpassword',
                role: domain_model_1.UserRole.SELLER,
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
        (0, globals_1.afterEach)(async () => {
            await mongoose.connection.dropCollection('products').catch(() => { });
            await mongoose.connection.dropCollection('users').catch(() => { });
            await mongoose.connection.dropCollection('categories').catch(() => { });
            safeDeleteModel('Product');
            safeDeleteModel('User');
            safeDeleteModel('Category');
        });
        (0, globals_1.it)('should create a valid product document', async () => {
            const productData = {
                title: 'Test Product',
                description: 'A test product description',
                price: { amount: 99.99, currency: 'PHP' },
                sellerId,
                categoryId,
                status: domain_model_1.ProductStatus.ACTIVE,
                condition: domain_model_1.ProductCondition.NEW,
                images: [{ url: 'http://example.com/image.jpg', isPrimary: true }],
            };
            const product = new ProductModel(productData);
            const savedProduct = await product.save();
            (0, globals_1.expect)(savedProduct._id).toBeDefined();
            (0, globals_1.expect)(savedProduct.title).toBe(productData.title);
            (0, globals_1.expect)(savedProduct.description).toBe(productData.description);
            (0, globals_1.expect)(savedProduct.price.amount).toBe(productData.price.amount);
            (0, globals_1.expect)(savedProduct.price.currency).toBe(productData.price.currency);
            (0, globals_1.expect)(savedProduct.sellerId.toString()).toBe(sellerId);
            (0, globals_1.expect)(savedProduct.categoryId.toString()).toBe(categoryId);
            (0, globals_1.expect)(savedProduct.status).toBe(productData.status);
            (0, globals_1.expect)(savedProduct.condition).toBe(productData.condition);
            (0, globals_1.expect)(savedProduct.images[0].url).toBe(productData.images[0].url);
            (0, globals_1.expect)(savedProduct.createdAt).toBeInstanceOf(Date);
            (0, globals_1.expect)(savedProduct.updatedAt).toBeInstanceOf(Date);
            (0, globals_1.expect)(savedProduct.images[0].isPrimary).toBe(true);
        });
        (0, globals_1.it)('should check if product is available', async () => {
            const product = new ProductModel({
                title: 'Test Product',
                description: 'A test product description',
                price: { amount: 99.99, currency: 'PHP' },
                sellerId,
                categoryId,
                status: domain_model_1.ProductStatus.ACTIVE,
                condition: domain_model_1.ProductCondition.NEW,
                images: [{ url: 'http://example.com/image.jpg', isPrimary: true }],
            });
            await product.save();
            (0, globals_1.expect)(product.isAvailable()).toBe(true);
            product.status = domain_model_1.ProductStatus.SOLD;
            (0, globals_1.expect)(product.isAvailable()).toBe(false);
            (0, globals_1.expect)(product.createdAt).toBeInstanceOf(Date);
            (0, globals_1.expect)(product.updatedAt).toBeInstanceOf(Date);
            (0, globals_1.expect)(product.images[0].isPrimary).toBe(true);
        });
        (0, globals_1.it)('should get primary image', async () => {
            const product = new ProductModel({
                title: 'Test Product',
                description: 'A test product description',
                price: { amount: 99.99, currency: 'PHP' },
                sellerId,
                categoryId,
                status: domain_model_1.ProductStatus.ACTIVE,
                condition: domain_model_1.ProductCondition.NEW,
                images: [
                    { url: 'http://example.com/image1.jpg', isPrimary: false },
                    { url: 'http://example.com/image2.jpg', isPrimary: true },
                ],
            });
            await product.save();
            const primaryImage = product.getPrimaryImage();
            (0, globals_1.expect)(primaryImage).toBeDefined();
            (0, globals_1.expect)(primaryImage?.url).toBe('http://example.com/image2.jpg');
        });
    });
    (0, globals_1.describe)('Order Schema', () => {
        let OrderModel;
        let UserModel;
        let buyerId;
        let sellerId;
        (0, globals_1.beforeEach)(async () => {
            safeDeleteModel('User');
            safeDeleteModel('Order');
            UserModel = mongoose.model('User', schemas_1.UserSchema);
            OrderModel = mongoose.model('Order', schemas_1.OrderSchema);
            const buyer = new UserModel({
                email: 'buyer@example.com',
                name: 'Buyer',
                passwordHash: 'hashedpassword',
                role: domain_model_1.UserRole.BUYER,
            });
            const seller = new UserModel({
                email: 'seller@example.com',
                name: 'Seller',
                passwordHash: 'hashedpassword',
                role: domain_model_1.UserRole.SELLER,
            });
            const savedBuyer = await buyer.save();
            const savedSeller = await seller.save();
            buyerId = savedBuyer._id.toString();
            sellerId = savedSeller._id.toString();
        });
        (0, globals_1.afterEach)(async () => {
            await mongoose.connection.dropCollection('orders').catch(() => { });
            await mongoose.connection.dropCollection('users').catch(() => { });
            safeDeleteModel('Order');
            safeDeleteModel('User');
        });
        (0, globals_1.it)('should create a valid order document', async () => {
            const orderData = {
                buyerId,
                sellerId,
                status: domain_model_1.OrderStatus.CREATED,
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
            (0, globals_1.expect)(savedOrder._id).toBeDefined();
            (0, globals_1.expect)(savedOrder.buyerId.toString()).toBe(buyerId);
            (0, globals_1.expect)(savedOrder.sellerId.toString()).toBe(sellerId);
            (0, globals_1.expect)(savedOrder.status).toBe(orderData.status);
            (0, globals_1.expect)(savedOrder.items.length).toBe(1);
            (0, globals_1.expect)(savedOrder.items[0].quantity).toBe(orderData.items[0].quantity);
            (0, globals_1.expect)(savedOrder.subtotal.amount).toBe(orderData.subtotal.amount);
            (0, globals_1.expect)(savedOrder.tax.amount).toBe(orderData.tax.amount);
            (0, globals_1.expect)(savedOrder.total.amount).toBe(orderData.total.amount);
            (0, globals_1.expect)(savedOrder.shippingAddress.street).toBe(orderData.shippingAddress.street);
            (0, globals_1.expect)(savedOrder.createdAt).toBeInstanceOf(Date);
            (0, globals_1.expect)(savedOrder.updatedAt).toBeInstanceOf(Date);
        });
        (0, globals_1.it)('should check order status permissions', async () => {
            const order = new OrderModel({
                buyerId,
                sellerId,
                status: domain_model_1.OrderStatus.CREATED,
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
            (0, globals_1.expect)(order.canBeCancelled()).toBe(true);
            (0, globals_1.expect)(order.canBeShipped()).toBe(false);
            (0, globals_1.expect)(order.canBeDelivered()).toBe(false);
            (0, globals_1.expect)(order.canBeRefunded()).toBe(false);
            order.status = domain_model_1.OrderStatus.PAID;
            (0, globals_1.expect)(order.canBeCancelled()).toBe(true);
            (0, globals_1.expect)(order.canBeShipped()).toBe(true);
            (0, globals_1.expect)(order.canBeDelivered()).toBe(false);
            (0, globals_1.expect)(order.canBeRefunded()).toBe(true);
            order.status = domain_model_1.OrderStatus.SHIPPED;
            (0, globals_1.expect)(order.canBeCancelled()).toBe(false);
            (0, globals_1.expect)(order.canBeShipped()).toBe(false);
            (0, globals_1.expect)(order.canBeDelivered()).toBe(true);
            (0, globals_1.expect)(order.canBeRefunded()).toBe(true);
        });
    });
});
//# sourceMappingURL=schemas.test.js.map