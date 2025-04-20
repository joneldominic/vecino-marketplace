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
exports.ProductSchema = exports.Product = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const domain_model_1 = require("../../../domain/models/domain-model");
const common_schema_1 = require("./common.schema");
let Product = class Product extends mongoose_2.Document {
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: common_schema_1.MoneySchema, required: true }),
    __metadata("design:type", Object)
], Product.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], Product.prototype, "sellerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(domain_model_1.ProductStatus),
        default: domain_model_1.ProductStatus.DRAFT,
        index: true,
    }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(domain_model_1.ProductCondition),
        required: true,
    }),
    __metadata("design:type", String)
], Product.prototype, "condition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: common_schema_1.GeoLocationSchema }),
    __metadata("design:type", Object)
], Product.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [common_schema_1.ProductSpecificationSchema], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "specifications", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [common_schema_1.ImageMetadataSchema], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "tags", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'products',
    })
], Product);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);
exports.ProductSchema.index({ title: 'text', description: 'text', tags: 'text' }, { weights: { title: 10, tags: 5, description: 3 } });
exports.ProductSchema.index({ categoryId: 1, status: 1 });
exports.ProductSchema.index({ sellerId: 1, status: 1 });
exports.ProductSchema.index({ 'price.amount': 1 });
exports.ProductSchema.index({ 'location.coordinates': '2dsphere' }, { sparse: true });
exports.ProductSchema.methods.isAvailable = function () {
    return this.status === domain_model_1.ProductStatus.ACTIVE;
};
exports.ProductSchema.methods.getPrimaryImage = function () {
    if (!this.images || this.images.length === 0) {
        return null;
    }
    const primaryImage = this.images.find((img) => img.isPrimary);
    return primaryImage || this.images[0];
};
//# sourceMappingURL=product.schema.js.map