/**
 * Domain Model for Vecino Marketplace
 *
 * This file defines the core domain models and bounded contexts for the marketplace application,
 * following Domain-Driven Design principles.
 */

// ===============================================================
// Shared Types (Value Objects)
// ===============================================================

/**
 * Address value object
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Money value object
 */
export interface Money {
  amount: number;
  currency: string; // Currently only supports 'PHP'
}

/**
 * GeoLocation value object for location-based services
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  radius?: number; // Optional radius in km for proximity searches
}

/**
 * Image metadata value object
 */
export interface ImageMetadata {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
}

// ===============================================================
// Identity and Access (Shared across contexts)
// ===============================================================

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  address?: Address;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===============================================================
// Product Catalog Context
// ===============================================================

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SOLD = 'sold',
  INACTIVE = 'inactive',
}

export enum ProductCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
}

export interface ProductSpecification {
  key: string;
  value: string;
  unit?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentCategoryId?: string;
  attributes?: string[]; // List of attributes relevant to this category
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: Money;
  sellerId: string;
  categoryId: string;
  status: ProductStatus;
  condition: ProductCondition;
  location?: GeoLocation;
  specifications?: ProductSpecification[];
  images: ImageMetadata[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  reviewerId: string;
  rating: number; // 1-5
  title?: string;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===============================================================
// Ordering Context
// ===============================================================

export enum OrderStatus {
  CREATED = 'created',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productSnapshot: Partial<Product>; // Snapshot of product at time of order
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: Money;
  tax: Money;
  total: Money;
  shippingAddress: Address;
  paymentMethod?: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===============================================================
// Messaging Context
// ===============================================================

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  productId?: string; // Optional, if conversation is about a specific product
  lastMessageId?: string;
  lastMessageAt: Date;
  createdAt: Date;
}

// ===============================================================
// Notification Context
// ===============================================================

export enum NotificationType {
  ORDER_STATUS = 'order_status',
  MESSAGE = 'message',
  REVIEW = 'review',
  PRODUCT_UPDATE = 'product_update',
  SYSTEM = 'system',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>; // Additional data relevant to the notification
  createdAt: Date;
}
