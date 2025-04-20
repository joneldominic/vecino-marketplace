"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.OrderStatus = exports.ProductCondition = exports.ProductStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["BUYER"] = "buyer";
    UserRole["SELLER"] = "seller";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "draft";
    ProductStatus["ACTIVE"] = "active";
    ProductStatus["SOLD"] = "sold";
    ProductStatus["INACTIVE"] = "inactive";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var ProductCondition;
(function (ProductCondition) {
    ProductCondition["NEW"] = "new";
    ProductCondition["LIKE_NEW"] = "like_new";
    ProductCondition["GOOD"] = "good";
    ProductCondition["FAIR"] = "fair";
    ProductCondition["POOR"] = "poor";
})(ProductCondition || (exports.ProductCondition = ProductCondition = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["CREATED"] = "created";
    OrderStatus["PAID"] = "paid";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["REFUNDED"] = "refunded";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["ORDER_STATUS"] = "order_status";
    NotificationType["MESSAGE"] = "message";
    NotificationType["REVIEW"] = "review";
    NotificationType["PRODUCT_UPDATE"] = "product_update";
    NotificationType["SYSTEM"] = "system";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=domain-model.js.map