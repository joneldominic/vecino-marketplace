"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const DomainModel = require("../models/domain-model");
const domain_contexts_1 = require("../models/domain-contexts");
(0, globals_1.describe)('Domain Model', () => {
    (0, globals_1.describe)('Value Objects', () => {
        (0, globals_1.it)('should define Address value object with correct properties', () => {
            const address = {
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                postalCode: '62701',
                country: 'USA',
            };
            (0, globals_1.expect)(address).toHaveProperty('street');
            (0, globals_1.expect)(address).toHaveProperty('city');
            (0, globals_1.expect)(address).toHaveProperty('state');
            (0, globals_1.expect)(address).toHaveProperty('postalCode');
            (0, globals_1.expect)(address).toHaveProperty('country');
        });
        (0, globals_1.it)('should define Money value object with correct properties', () => {
            const money = {
                amount: 99.99,
                currency: 'PHP',
            };
            (0, globals_1.expect)(money).toHaveProperty('amount');
            (0, globals_1.expect)(money).toHaveProperty('currency');
        });
        (0, globals_1.it)('should define GeoLocation value object with correct properties', () => {
            const location = {
                latitude: 40.7128,
                longitude: -74.006,
                radius: 5,
            };
            (0, globals_1.expect)(location).toHaveProperty('latitude');
            (0, globals_1.expect)(location).toHaveProperty('longitude');
            (0, globals_1.expect)(location).toHaveProperty('radius');
        });
    });
    (0, globals_1.describe)('Entities', () => {
        (0, globals_1.it)('should define User entity with correct properties', () => {
            const user = {
                id: '123',
                email: 'user@example.com',
                name: 'Test User',
                passwordHash: 'hashedpassword',
                role: DomainModel.UserRole.BUYER,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            (0, globals_1.expect)(user).toHaveProperty('id');
            (0, globals_1.expect)(user).toHaveProperty('email');
            (0, globals_1.expect)(user).toHaveProperty('name');
            (0, globals_1.expect)(user).toHaveProperty('passwordHash');
            (0, globals_1.expect)(user).toHaveProperty('role');
            (0, globals_1.expect)(user).toHaveProperty('createdAt');
            (0, globals_1.expect)(user).toHaveProperty('updatedAt');
        });
        (0, globals_1.it)('should define Product entity with correct properties', () => {
            const product = {
                id: '123',
                title: 'Test Product',
                description: 'A test product description',
                price: { amount: 99.99, currency: 'PHP' },
                sellerId: 'seller123',
                categoryId: 'category123',
                status: DomainModel.ProductStatus.ACTIVE,
                condition: DomainModel.ProductCondition.NEW,
                images: [{ url: 'http://example.com/image.jpg', isPrimary: true }],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            (0, globals_1.expect)(product).toHaveProperty('id');
            (0, globals_1.expect)(product).toHaveProperty('title');
            (0, globals_1.expect)(product).toHaveProperty('description');
            (0, globals_1.expect)(product).toHaveProperty('price');
            (0, globals_1.expect)(product).toHaveProperty('sellerId');
            (0, globals_1.expect)(product).toHaveProperty('categoryId');
            (0, globals_1.expect)(product).toHaveProperty('status');
            (0, globals_1.expect)(product).toHaveProperty('condition');
            (0, globals_1.expect)(product).toHaveProperty('images');
            (0, globals_1.expect)(product).toHaveProperty('createdAt');
            (0, globals_1.expect)(product).toHaveProperty('updatedAt');
        });
        (0, globals_1.it)('should define Order entity with correct properties', () => {
            const order = {
                id: '123',
                buyerId: 'buyer123',
                sellerId: 'seller123',
                status: DomainModel.OrderStatus.CREATED,
                items: [
                    {
                        id: 'item1',
                        orderId: '123',
                        productId: 'prod1',
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
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            (0, globals_1.expect)(order).toHaveProperty('id');
            (0, globals_1.expect)(order).toHaveProperty('buyerId');
            (0, globals_1.expect)(order).toHaveProperty('sellerId');
            (0, globals_1.expect)(order).toHaveProperty('status');
            (0, globals_1.expect)(order).toHaveProperty('items');
            (0, globals_1.expect)(order).toHaveProperty('subtotal');
            (0, globals_1.expect)(order).toHaveProperty('tax');
            (0, globals_1.expect)(order).toHaveProperty('total');
            (0, globals_1.expect)(order).toHaveProperty('shippingAddress');
            (0, globals_1.expect)(order).toHaveProperty('createdAt');
            (0, globals_1.expect)(order).toHaveProperty('updatedAt');
        });
    });
    (0, globals_1.describe)('Bounded Contexts', () => {
        (0, globals_1.it)('should define Identity Context with correct types', () => {
            (0, globals_1.expect)(domain_contexts_1.IdentityContext).toBeDefined();
            const user = {
                id: '123',
                email: 'user@example.com',
                name: 'Test User',
                passwordHash: 'hashedpassword',
                role: DomainModel.UserRole.BUYER,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            (0, globals_1.expect)(user).toHaveProperty('id');
            (0, globals_1.expect)(user.role).toBe(DomainModel.UserRole.BUYER);
        });
        (0, globals_1.it)('should define Catalog Context with correct types', () => {
            (0, globals_1.expect)(domain_contexts_1.CatalogContext).toBeDefined();
            const product = {
                id: '123',
                title: 'Test Product',
                description: 'A test product description',
                price: { amount: 99.99, currency: 'PHP' },
                sellerId: 'seller123',
                categoryId: 'category123',
                status: DomainModel.ProductStatus.ACTIVE,
                condition: DomainModel.ProductCondition.NEW,
                images: [{ url: 'http://example.com/image.jpg', isPrimary: true }],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            (0, globals_1.expect)(product).toHaveProperty('id');
            (0, globals_1.expect)(product.status).toBe(DomainModel.ProductStatus.ACTIVE);
        });
        (0, globals_1.it)('should define Ordering Context with correct types', () => {
            (0, globals_1.expect)(domain_contexts_1.OrderingContext).toBeDefined();
            const orderStatus = DomainModel.OrderStatus.PAID;
            (0, globals_1.expect)(orderStatus).toBe(DomainModel.OrderStatus.PAID);
        });
    });
    (0, globals_1.describe)('Context Map', () => {
        (0, globals_1.it)('should define context relationships', () => {
            (0, globals_1.expect)(domain_contexts_1.ContextMap.contextRelationships).toBeDefined();
            (0, globals_1.expect)(Array.isArray(domain_contexts_1.ContextMap.contextRelationships)).toBeTruthy();
            (0, globals_1.expect)(domain_contexts_1.ContextMap.contextRelationships.length).toBeGreaterThan(0);
            const identityRelationships = domain_contexts_1.ContextMap.contextRelationships.filter(rel => rel.upstream === domain_contexts_1.ContextMap.BoundedContext.IDENTITY);
            (0, globals_1.expect)(identityRelationships.length).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=domain-model.test.js.map