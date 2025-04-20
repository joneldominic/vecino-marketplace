import { Model } from 'mongoose';
import { ProductRepository } from '../../../domain/repositories/product-repository.interface';
import { Product as ProductEntity, ProductStatus, GeoLocation } from '../../../domain/models/domain-model';
import { Product as ProductModel } from '../../../database/mongodb/schemas/product.schema';
import { ProductMapper } from '../../mappers/product.mapper';
import { BaseMongoDBRepository } from './base-mongodb.repository';
export declare class ProductMongoDBRepository extends BaseMongoDBRepository<ProductEntity, ProductModel> implements ProductRepository {
    private productMapper;
    constructor(productModel: Model<ProductModel>, productMapper: ProductMapper);
    findBySeller(sellerId: string, options?: {
        skip?: number;
        limit?: number;
    }): Promise<ProductEntity[]>;
    findByCategory(categoryId: string, options?: {
        skip?: number;
        limit?: number;
    }): Promise<ProductEntity[]>;
    search(searchQuery: string, options?: {
        skip?: number;
        limit?: number;
    }): Promise<ProductEntity[]>;
    findByStatus(status: ProductStatus, options?: {
        skip?: number;
        limit?: number;
    }): Promise<ProductEntity[]>;
    findByLocation(location: GeoLocation, options?: {
        skip?: number;
        limit?: number;
    }): Promise<ProductEntity[]>;
    updateStatus(id: string, status: ProductStatus): Promise<ProductEntity | null>;
    addImage(id: string, imageUrl: string, isPrimary?: boolean): Promise<ProductEntity | null>;
    removeImage(id: string, imageUrl: string): Promise<ProductEntity | null>;
}
