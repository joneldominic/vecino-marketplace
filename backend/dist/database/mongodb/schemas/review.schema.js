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
exports.ReviewSchema = exports.Review = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Review = class Review extends mongoose_2.Document {
};
exports.Review = Review;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], Review.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], Review.prototype, "reviewerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer between 1 and 5',
        },
    }),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Review.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Review.prototype, "comment", void 0);
exports.Review = Review = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'reviews',
    })
], Review);
exports.ReviewSchema = mongoose_1.SchemaFactory.createForClass(Review);
exports.ReviewSchema.index({ productId: 1, reviewerId: 1 }, { unique: true });
exports.ReviewSchema.index({ productId: 1, rating: 1 });
exports.ReviewSchema.index({ title: 'text', comment: 'text' });
exports.ReviewSchema.statics.calculateAverageRating = async function (productId) {
    const result = await this.aggregate([
        { $match: { productId: new mongoose_2.Schema.Types.ObjectId(productId) } },
        { $group: { _id: '$productId', avgRating: { $avg: '$rating' } } },
    ]);
    return result.length > 0 ? result[0].avgRating : 0;
};
//# sourceMappingURL=review.schema.js.map