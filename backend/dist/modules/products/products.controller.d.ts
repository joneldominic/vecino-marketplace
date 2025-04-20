import { ProductsService } from './products.service';
import { Product, ProductStatus } from '../../domain/models/domain-model';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(skip?: number, limit?: number): Promise<Product[]>;
    findById(id: string): Promise<Product>;
    search(query: string, skip?: number, limit?: number): Promise<Product[]>;
    findBySeller(sellerId: string, skip?: number, limit?: number): Promise<Product[]>;
    findByCategory(categoryId: string, skip?: number, limit?: number): Promise<Product[]>;
    findByStatus(status: ProductStatus, skip?: number, limit?: number): Promise<Product[]>;
    findByLocation(latitude: number, longitude: number, radius?: number, skip?: number, limit?: number): Promise<Product[]>;
    create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
    update(id: string, productData: Partial<Product>): Promise<Product>;
    delete(id: string): Promise<Product>;
    updateStatus(id: string, status: ProductStatus): Promise<Product>;
    addImage(id: string, imageUrl: string, isPrimary?: boolean): Promise<Product>;
    removeImage(id: string, imageUrl: string): Promise<Product>;
}
