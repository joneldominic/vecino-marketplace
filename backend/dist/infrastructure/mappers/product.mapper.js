"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMapper = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
let ProductMapper = class ProductMapper {
    toDomain(model) {
        if (!model) {
            return {};
        }
        const { _id, title, description, price, sellerId, categoryId, status, condition, location, specifications, images, tags, } = model;
        const timestamp = model.toObject ? model.toObject() : model;
        const createdAt = timestamp.createdAt;
        const updatedAt = timestamp.updatedAt;
        const id = _id.toString();
        return {
            id,
            title,
            description,
            price: this.convertToMoney(price),
            sellerId: this.getIdAsString(sellerId),
            categoryId: this.getIdAsString(categoryId),
            status,
            condition,
            location: location ? this.convertToGeoLocation(location) : undefined,
            specifications: specifications ? this.convertToSpecifications(specifications) : undefined,
            images: this.convertToImages(images),
            tags: tags || [],
            createdAt,
            updatedAt,
        };
    }
    toPersistence(entity) {
        if (!entity) {
            return {};
        }
        const result = {
            ...(entity.id && { _id: this.convertToObjectId(entity.id) }),
            title: entity.title,
            description: entity.description,
            price: entity.price,
            status: entity.status,
            condition: entity.condition,
            location: entity.location,
            specifications: entity.specifications,
            images: entity.images,
            tags: entity.tags,
        };
        if (entity.sellerId) {
            const sellerObjectId = this.convertToObjectId(entity.sellerId);
            if (sellerObjectId) {
                result.sellerId = entity.sellerId;
            }
        }
        if (entity.categoryId) {
            const categoryObjectId = this.convertToObjectId(entity.categoryId);
            if (categoryObjectId) {
                result.categoryId = entity.categoryId;
            }
        }
        return result;
    }
    convertToObjectId(id) {
        if (!id)
            return null;
        return mongoose_1.Types.ObjectId.isValid(id) ? new mongoose_1.Types.ObjectId(id) : null;
    }
    convertToMoney(moneyDoc) {
        if (!moneyDoc) {
            return { amount: 0, currency: 'PHP' };
        }
        return {
            amount: moneyDoc.amount,
            currency: moneyDoc.currency,
        };
    }
    convertToGeoLocation(locationDoc) {
        if (!locationDoc) {
            return { latitude: 0, longitude: 0 };
        }
        return {
            latitude: locationDoc.latitude,
            longitude: locationDoc.longitude,
            radius: locationDoc.radius,
        };
    }
    convertToSpecifications(specsDoc) {
        if (!specsDoc || !Array.isArray(specsDoc))
            return [];
        return specsDoc.map(spec => ({
            key: spec.key,
            value: spec.value,
            unit: spec.unit,
        }));
    }
    convertToImages(imagesDoc) {
        if (!imagesDoc || !Array.isArray(imagesDoc))
            return [];
        return imagesDoc.map(image => ({
            url: image.url,
            alt: image.alt,
            width: image.width,
            height: image.height,
            isPrimary: image.isPrimary,
        }));
    }
    getIdAsString(id) {
        if (!id)
            return '';
        if (typeof id === 'object' && id.toString)
            return id.toString();
        return String(id);
    }
};
exports.ProductMapper = ProductMapper;
exports.ProductMapper = ProductMapper = __decorate([
    (0, common_1.Injectable)()
], ProductMapper);
//# sourceMappingURL=product.mapper.js.map