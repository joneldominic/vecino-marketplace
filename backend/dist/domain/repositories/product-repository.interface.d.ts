import { GeoLocation, Product, ProductStatus } from '../models/domain-model';
import { BaseRepository } from './base-repository.interface';
export interface ProductRepository extends BaseRepository<Product, string> {
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
    updateStatus(id: string, status: ProductStatus): Promise<Product | null>;
    addImage(id: string, imageUrl: string, isPrimary?: boolean): Promise<Product | null>;
    removeImage(id: string, imageUrl: string): Promise<Product | null>;
}
