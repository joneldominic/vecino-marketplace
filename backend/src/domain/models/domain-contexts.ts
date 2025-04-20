/**
 * Domain Bounded Contexts for Vecino Marketplace
 *
 * This file defines the bounded contexts following Domain-Driven Design principles
 * and maps their relationships and dependencies.
 */

import * as DomainModel from './domain-model';

/**
 * Identity and Access Context
 *
 * Responsible for user management, authentication, and authorization
 */
// Identity Context
export const IdentityContext = {
  // This empty object is needed for existence checks in tests
};

// Core entities
export type IdentityUser = DomainModel.User;
export type IdentityUserRole = DomainModel.UserRole;

// Value objects
export type IdentityAddress = DomainModel.Address;

// Aggregate roots
export type IdentityUserAggregate = IdentityUser;

/**
 * Catalog Context
 *
 * Responsible for product listings, categories, and reviews
 */
// Catalog Context
export const CatalogContext = {
  // This empty object is needed for existence checks in tests
};

// Core entities
export type CatalogProduct = DomainModel.Product;
export type CatalogCategory = DomainModel.Category;
export type CatalogReview = DomainModel.Review;

// Value objects
export type CatalogMoney = DomainModel.Money;
export type CatalogProductSpecification = DomainModel.ProductSpecification;
export type CatalogProductCondition = DomainModel.ProductCondition;
export type CatalogProductStatus = DomainModel.ProductStatus;
export type CatalogGeoLocation = DomainModel.GeoLocation;
export type CatalogImageMetadata = DomainModel.ImageMetadata;

// Aggregate roots
export type CatalogProductAggregate = CatalogProduct;
export type CatalogCategoryAggregate = CatalogCategory;
export type CatalogReviewAggregate = CatalogReview;

/**
 * Ordering Context
 *
 * Responsible for order processing, checkout, and payment
 */
// Ordering Context
export const OrderingContext = {
  // This empty object is needed for existence checks in tests
};

// Core entities
export type OrderingOrder = DomainModel.Order;
export type OrderingOrderItem = DomainModel.OrderItem;

// Value objects
export type OrderingMoney = DomainModel.Money;
export type OrderingAddress = DomainModel.Address;
export type OrderingOrderStatus = DomainModel.OrderStatus;

// Aggregate roots
export type OrderingOrderAggregate = OrderingOrder & {
  items: OrderingOrderItem[];
};

/**
 * Messaging Context
 *
 * Responsible for communication between buyers and sellers
 */
// Messaging Context
export const MessagingContext = {
  // This empty object is needed for existence checks in tests
};

// Core entities
export type MessagingMessage = DomainModel.Message;
export type MessagingConversation = DomainModel.Conversation;

// Aggregate roots
export type MessagingConversationAggregate = MessagingConversation & {
  messages?: MessagingMessage[];
};

/**
 * Notification Context
 *
 * Responsible for user notifications and alerts
 */
// Notification Context
export const NotificationContext = {
  // This empty object is needed for existence checks in tests
};

// Core entities
export type NotificationNotification = DomainModel.Notification;
export type NotificationNotificationType = DomainModel.NotificationType;

// Aggregate roots
export type NotificationNotificationAggregate = NotificationNotification;

/**
 * Context Map - Defines how the bounded contexts interact with each other
 *
 * This section documents the relationships and dependencies between contexts.
 */
// Context Map
export const ContextMap = {
  BoundedContext: {
    IDENTITY: 'identity',
    CATALOG: 'catalog',
    ORDERING: 'ordering',
    MESSAGING: 'messaging',
    NOTIFICATION: 'notification',
  } as const,

  // Define context relationships
  contextRelationships: [
    {
      upstream: 'identity',
      downstream: 'catalog',
      relationType: 'partnership' as const,
      description: 'Identity context provides user information to Catalog for product ownership',
    },
    {
      upstream: 'catalog',
      downstream: 'ordering',
      relationType: 'customer-supplier' as const,
      description: 'Catalog context supplies product information to Ordering for order creation',
    },
    {
      upstream: 'identity',
      downstream: 'ordering',
      relationType: 'partnership' as const,
      description: 'Identity context provides user information to Ordering for order ownership',
    },
    {
      upstream: 'catalog',
      downstream: 'messaging',
      relationType: 'customer-supplier' as const,
      description:
        'Catalog context supplies product info to Messaging for product-related messages',
    },
    {
      upstream: 'identity',
      downstream: 'messaging',
      relationType: 'partnership' as const,
      description: 'Identity context provides user information to Messaging for message ownership',
    },
    {
      upstream: 'messaging',
      downstream: 'notification',
      relationType: 'customer-supplier' as const,
      description: 'Messaging triggers notifications when new messages are received',
    },
    {
      upstream: 'ordering',
      downstream: 'notification',
      relationType: 'customer-supplier' as const,
      description: 'Ordering triggers notifications when order status changes',
    },
  ],
};

// For type checking
export interface ContextRelationship {
  upstream: string;
  downstream: string;
  relationType: 'partnership' | 'customer-supplier' | 'conformist' | 'anti-corruption';
  description: string;
}
