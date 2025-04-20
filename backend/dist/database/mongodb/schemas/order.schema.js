"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.Order = exports.OrderItemSchema = exports.OrderItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const domain_model_1 = require("../../../domain/models/domain-model");
const common_schema_1 = require("./common.schema");
let OrderItem = class OrderItem extends mongoose_2.Document {
};
exports.OrderItem = OrderItem;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], OrderItem.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], OrderItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed, required: true }),
    __metadata("design:type", Object)
], OrderItem.prototype, "productSnapshot", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 1, default: 1 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: common_schema_1.MoneySchema, required: true }),
    __metadata("design:type", Object)
], OrderItem.prototype, "unitPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: common_schema_1.MoneySchema, required: true }),
    __metadata("design:type", Object)
], OrderItem.prototype, "totalPrice", void 0);
exports.OrderItem = OrderItem = __decorate([
    (0, mongoose_1.Schema)({ _id: true, timestamps: false })
], OrderItem);
exports.OrderItemSchema = mongoose_1.SchemaFactory.createForClass(OrderItem);
let Order = class Order extends mongoose_2.Document {
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "buyerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "sellerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(domain_model_1.OrderStatus),
        default: domain_model_1.OrderStatus.CREATED,
        index: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.OrderItemSchema], default: [] }),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: common_schema_1.MoneySchema, required: true }),
    __metadata("design:type", Object)
], Order.prototype, "subtotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: common_schema_1.MoneySchema, required: true }),
    __metadata("design:type", Object)
], Order.prototype, "tax", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: common_schema_1.MoneySchema, required: true }),
    __metadata("design:type", Object)
], Order.prototype, "total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: common_schema_1.AddressSchema, required: true }),
    __metadata("design:type", Object)
], Order.prototype, "shippingAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Order.prototype, "paymentId", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'orders',
    })
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
exports.OrderSchema.index({ status: 1, createdAt: -1 });
exports.OrderSchema.index({ buyerId: 1, status: 1, createdAt: -1 });
exports.OrderSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
exports.OrderSchema.methods.canBeCancelled = function () {
    return [domain_model_1.OrderStatus.CREATED, domain_model_1.OrderStatus.PAID].includes(this.status);
};
exports.OrderSchema.methods.canBeShipped = function () {
    return this.status === domain_model_1.OrderStatus.PAID;
};
exports.OrderSchema.methods.canBeDelivered = function () {
    return this.status === domain_model_1.OrderStatus.SHIPPED;
};
exports.OrderSchema.methods.canBeRefunded = function () {
    return [domain_model_1.OrderStatus.PAID, domain_model_1.OrderStatus.SHIPPED, domain_model_1.OrderStatus.DELIVERED].includes(this.status);
};
//# sourceMappingURL=order.schema.js.map