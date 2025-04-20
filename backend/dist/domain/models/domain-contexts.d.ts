import * as DomainModel from './domain-model';
export declare const IdentityContext: {};
export type IdentityUser = DomainModel.User;
export type IdentityUserRole = DomainModel.UserRole;
export type IdentityAddress = DomainModel.Address;
export type IdentityUserAggregate = IdentityUser;
export declare const CatalogContext: {};
export type CatalogProduct = DomainModel.Product;
export type CatalogCategory = DomainModel.Category;
export type CatalogReview = DomainModel.Review;
export type CatalogMoney = DomainModel.Money;
export type CatalogProductSpecification = DomainModel.ProductSpecification;
export type CatalogProductCondition = DomainModel.ProductCondition;
export type CatalogProductStatus = DomainModel.ProductStatus;
export type CatalogGeoLocation = DomainModel.GeoLocation;
export type CatalogImageMetadata = DomainModel.ImageMetadata;
export type CatalogProductAggregate = CatalogProduct;
export type CatalogCategoryAggregate = CatalogCategory;
export type CatalogReviewAggregate = CatalogReview;
export declare const OrderingContext: {};
export type OrderingOrder = DomainModel.Order;
export type OrderingOrderItem = DomainModel.OrderItem;
export type OrderingMoney = DomainModel.Money;
export type OrderingAddress = DomainModel.Address;
export type OrderingOrderStatus = DomainModel.OrderStatus;
export type OrderingOrderAggregate = OrderingOrder & {
    items: OrderingOrderItem[];
};
export declare const MessagingContext: {};
export type MessagingMessage = DomainModel.Message;
export type MessagingConversation = DomainModel.Conversation;
export type MessagingConversationAggregate = MessagingConversation & {
    messages?: MessagingMessage[];
};
export declare const NotificationContext: {};
export type NotificationNotification = DomainModel.Notification;
export type NotificationNotificationType = DomainModel.NotificationType;
export type NotificationNotificationAggregate = NotificationNotification;
export declare const ContextMap: {
    BoundedContext: {
        readonly IDENTITY: "identity";
        readonly CATALOG: "catalog";
        readonly ORDERING: "ordering";
        readonly MESSAGING: "messaging";
        readonly NOTIFICATION: "notification";
    };
    contextRelationships: ({
        upstream: string;
        downstream: string;
        relationType: "partnership";
        description: string;
    } | {
        upstream: string;
        downstream: string;
        relationType: "customer-supplier";
        description: string;
    })[];
};
export interface ContextRelationship {
    upstream: string;
    downstream: string;
    relationType: 'partnership' | 'customer-supplier' | 'conformist' | 'anti-corruption';
    description: string;
}
