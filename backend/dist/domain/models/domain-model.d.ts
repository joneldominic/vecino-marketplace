export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
export interface Money {
    amount: number;
    currency: string;
}
export interface GeoLocation {
    latitude: number;
    longitude: number;
    radius?: number;
}
export interface ImageMetadata {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
    isPrimary?: boolean;
}
export declare enum UserRole {
    BUYER = "buyer",
    SELLER = "seller",
    ADMIN = "admin"
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
export declare enum ProductStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    SOLD = "sold",
    INACTIVE = "inactive"
}
export declare enum ProductCondition {
    NEW = "new",
    LIKE_NEW = "like_new",
    GOOD = "good",
    FAIR = "fair",
    POOR = "poor"
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
    attributes?: string[];
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
    rating: number;
    title?: string;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum OrderStatus {
    CREATED = "created",
    PAID = "paid",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    productSnapshot: Partial<Product>;
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
    participants: string[];
    productId?: string;
    lastMessageId?: string;
    lastMessageAt: Date;
    createdAt: Date;
}
export declare enum NotificationType {
    ORDER_STATUS = "order_status",
    MESSAGE = "message",
    REVIEW = "review",
    PRODUCT_UPDATE = "product_update",
    SYSTEM = "system"
}
export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    data?: Record<string, any>;
    createdAt: Date;
}
