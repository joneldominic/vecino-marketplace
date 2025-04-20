"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextMap = exports.NotificationContext = exports.MessagingContext = exports.OrderingContext = exports.CatalogContext = exports.IdentityContext = void 0;
exports.IdentityContext = {};
exports.CatalogContext = {};
exports.OrderingContext = {};
exports.MessagingContext = {};
exports.NotificationContext = {};
exports.ContextMap = {
    BoundedContext: {
        IDENTITY: 'identity',
        CATALOG: 'catalog',
        ORDERING: 'ordering',
        MESSAGING: 'messaging',
        NOTIFICATION: 'notification',
    },
    contextRelationships: [
        {
            upstream: 'identity',
            downstream: 'catalog',
            relationType: 'partnership',
            description: 'Identity context provides user information to Catalog for product ownership',
        },
        {
            upstream: 'catalog',
            downstream: 'ordering',
            relationType: 'customer-supplier',
            description: 'Catalog context supplies product information to Ordering for order creation',
        },
        {
            upstream: 'identity',
            downstream: 'ordering',
            relationType: 'partnership',
            description: 'Identity context provides user information to Ordering for order ownership',
        },
        {
            upstream: 'catalog',
            downstream: 'messaging',
            relationType: 'customer-supplier',
            description: 'Catalog context supplies product info to Messaging for product-related messages',
        },
        {
            upstream: 'identity',
            downstream: 'messaging',
            relationType: 'partnership',
            description: 'Identity context provides user information to Messaging for message ownership',
        },
        {
            upstream: 'messaging',
            downstream: 'notification',
            relationType: 'customer-supplier',
            description: 'Messaging triggers notifications when new messages are received',
        },
        {
            upstream: 'ordering',
            downstream: 'notification',
            relationType: 'customer-supplier',
            description: 'Ordering triggers notifications when order status changes',
        },
    ],
};
//# sourceMappingURL=domain-contexts.js.map