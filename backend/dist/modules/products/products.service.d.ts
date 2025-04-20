import { ProductRepository } from '../../domain/repositories/product-repository.interface';
import { Product, ProductStatus, GeoLocation } from '../../domain/models/domain-model';
import { RedisService } from '../../database/redis/redis.service';
export declare class ProductsService {
    private readonly productRepository;
    private readonly redisService;
    constructor(productRepository: ProductRepository, redisService: RedisService);
    findAll(options?: {
        skip?: number;
        limit?: number;
    }): Promise<Product[]>;
    findById(id: string): Promise<Product>;
    findBySeller(sellerId: string, options?: {
        skip?: number;
        limit?: number;
    }): Promise<Product[]>;
    findByCategory(categoryId: string, options?: {
        skip?: number;
        limit?: number;
    }): Promise<Product[]>;
    search(query: string, options?: {
        skip?: number;
        limit?: number;
    }): Promise<Product[]>;
    findByStatus(status: ProductStatus, options?: {
        skip?: number;
        limit?: number;
    }): Promise<Product[]>;
    findByLocation(location: GeoLocation, options?: {
        skip?: number;
        limit?: number;
    }): Promise<Product[]>;
    create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
    update(id: string, productData: Partial<Product>): Promise<Product>;
    delete(id: string): Promise<Product>;
    updateStatus(id: string, status: ProductStatus): Promise<Product>;
    addImage(id: string, imageUrl: string, isPrimary?: boolean): Promise<Product>;
    removeImage(id: string, imageUrl: string): Promise<Product>;
}
