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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMongoDBRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../../../database/mongodb/schemas/product.schema");
const product_mapper_1 = require("../../mappers/product.mapper");
const base_mongodb_repository_1 = require("./base-mongodb.repository");
let ProductMongoDBRepository = class ProductMongoDBRepository extends base_mongodb_repository_1.BaseMongoDBRepository {
    constructor(productModel, productMapper) {
        super(productModel, productMapper);
        this.productMapper = productMapper;
    }
    async findBySeller(sellerId, options) {
        const query = this.model.find({
            sellerId: new mongoose_2.Types.ObjectId(sellerId),
        });
        if (options?.skip) {
            query.skip(options.skip);
        }
        if (options?.limit) {
            query.limit(options.limit);
        }
        const products = await query.exec();
        return products.map(product => this.mapper.toDomain(product));
    }
    async findByCategory(categoryId, options) {
        const query = this.model.find({
            categoryId: new mongoose_2.Types.ObjectId(categoryId),
        });
        if (options?.skip) {
            query.skip(options.skip);
        }
        if (options?.limit) {
            query.limit(options.limit);
        }
        const products = await query.exec();
        return products.map(product => this.mapper.toDomain(product));
    }
    async search(searchQuery, options) {
        const query = this.model.find({
            $text: { $search: searchQuery },
        });
        query.sort({ score: { $meta: 'textScore' } });
        if (options?.skip) {
            query.skip(options.skip);
        }
        if (options?.limit) {
            query.limit(options.limit);
        }
        const products = await query.exec();
        return products.map(product => this.mapper.toDomain(product));
    }
    async findByStatus(status, options) {
        const query = this.model.find({ status });
        if (options?.skip) {
            query.skip(options.skip);
        }
        if (options?.limit) {
            query.limit(options.limit);
        }
        const products = await query.exec();
        return products.map(product => this.mapper.toDomain(product));
    }
    async findByLocation(location, options) {
        const radiusInKm = location.radius || 10;
        const radiusInRadians = radiusInKm / 6371;
        const query = this.model.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[location.longitude, location.latitude], radiusInRadians],
                },
            },
        });
        if (options?.skip) {
            query.skip(options.skip);
        }
        if (options?.limit) {
            query.limit(options.limit);
        }
        const products = await query.exec();
        return products.map(product => this.mapper.toDomain(product));
    }
    async updateStatus(id, status) {
        const updatedProduct = await this.model
            .findByIdAndUpdate(new mongoose_2.Types.ObjectId(id), { $set: { status } }, { new: true })
            .exec();
        return updatedProduct ? this.mapper.toDomain(updatedProduct) : null;
    }
    async addImage(id, imageUrl, isPrimary = false) {
        let updateOperation;
        if (isPrimary) {
            await this.model
                .updateOne({ _id: new mongoose_2.Types.ObjectId(id) }, { $set: { 'images.$[].isPrimary': false } })
                .exec();
            updateOperation = {
                $push: {
                    images: { url: imageUrl, isPrimary: true },
                },
            };
        }
        else {
            updateOperation = {
                $push: {
                    images: { url: imageUrl, isPrimary: false },
                },
            };
        }
        const updatedProduct = await this.model
            .findByIdAndUpdate(new mongoose_2.Types.ObjectId(id), updateOperation, { new: true })
            .exec();
        return updatedProduct ? this.mapper.toDomain(updatedProduct) : null;
    }
    async removeImage(id, imageUrl) {
        const updatedProduct = await this.model
            .findByIdAndUpdate(new mongoose_2.Types.ObjectId(id), { $pull: { images: { url: imageUrl } } }, { new: true })
            .exec();
        const product = await this.model.findById(new mongoose_2.Types.ObjectId(id)).exec();
        if (product && product.images.length > 0) {
            const hasPrimary = product.images.some(img => img.isPrimary);
            if (!hasPrimary) {
                await this.model
                    .updateOne({ _id: new mongoose_2.Types.ObjectId(id) }, { $set: { 'images.0.isPrimary': true } })
                    .exec();
                return this.findById(id);
            }
        }
        return updatedProduct ? this.mapper.toDomain(updatedProduct) : null;
    }
};
exports.ProductMongoDBRepository = ProductMongoDBRepository;
exports.ProductMongoDBRepository = ProductMongoDBRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        product_mapper_1.ProductMapper])
], ProductMongoDBRepository);
//# sourceMappingURL=product-mongodb.repository.js.map