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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../database/redis/redis.service");
let ProductsService = class ProductsService {
    constructor(productRepository, redisService) {
        this.productRepository = productRepository;
        this.redisService = redisService;
    }
    async findAll(options) {
        if (!options?.skip && !options?.limit) {
            const cachedProducts = await this.redisService.get('all_products');
            if (cachedProducts) {
                return cachedProducts;
            }
        }
        const products = await this.productRepository.findAll(options);
        if (!options?.skip && !options?.limit) {
            await this.redisService.set('all_products', products, 300);
        }
        return products;
    }
    async findById(id) {
        const cacheKey = `product_${id}`;
        const cachedProduct = await this.redisService.get(cacheKey);
        if (cachedProduct) {
            return cachedProduct;
        }
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await this.redisService.set(cacheKey, product, 300);
        return product;
    }
    async findBySeller(sellerId, options) {
        return this.productRepository.findBySeller(sellerId, options);
    }
    async findByCategory(categoryId, options) {
        return this.productRepository.findByCategory(categoryId, options);
    }
    async search(query, options) {
        return this.productRepository.search(query, options);
    }
    async findByStatus(status, options) {
        return this.productRepository.findByStatus(status, options);
    }
    async findByLocation(location, options) {
        return this.productRepository.findByLocation(location, options);
    }
    async create(productData) {
        if (!productData.images) {
            productData.images = [];
        }
        if (!productData.tags) {
            productData.tags = [];
        }
        const product = await this.productRepository.create(productData);
        await this.redisService.delete('all_products');
        return product;
    }
    async update(id, productData) {
        const updatedProduct = await this.productRepository.update(id, productData);
        if (!updatedProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await this.redisService.delete(`product_${id}`);
        await this.redisService.delete('all_products');
        return updatedProduct;
    }
    async delete(id) {
        const deletedProduct = await this.productRepository.delete(id);
        if (!deletedProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await this.redisService.delete(`product_${id}`);
        await this.redisService.delete('all_products');
        return deletedProduct;
    }
    async updateStatus(id, status) {
        const updatedProduct = await this.productRepository.updateStatus(id, status);
        if (!updatedProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await this.redisService.delete(`product_${id}`);
        await this.redisService.delete('all_products');
        return updatedProduct;
    }
    async addImage(id, imageUrl, isPrimary = false) {
        const updatedProduct = await this.productRepository.addImage(id, imageUrl, isPrimary);
        if (!updatedProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await this.redisService.delete(`product_${id}`);
        await this.redisService.delete('all_products');
        return updatedProduct;
    }
    async removeImage(id, imageUrl) {
        const updatedProduct = await this.productRepository.removeImage(id, imageUrl);
        if (!updatedProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await this.redisService.delete(`product_${id}`);
        await this.redisService.delete('all_products');
        return updatedProduct;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepository')),
    __metadata("design:paramtypes", [Object, redis_service_1.RedisService])
], ProductsService);
//# sourceMappingURL=products.service.js.map