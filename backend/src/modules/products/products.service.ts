import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product-repository.interface';
import { Product, ProductStatus, GeoLocation } from '../../domain/models/domain-model';
import { RedisService } from '../../database/redis/redis.service';

/**
 * Products Service
 *
 * Handles business logic for product operations
 */
@Injectable()
export class ProductsService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Get all products with optional pagination
   */
  async findAll(options?: { skip?: number; limit?: number }): Promise<Product[]> {
    // Try to get from cache if no pagination
    if (!options?.skip && !options?.limit) {
      const cachedProducts = await this.redisService.get<Product[]>('all_products');
      if (cachedProducts) {
        return cachedProducts;
      }
    }

    const products = await this.productRepository.findAll(options);

    // Cache only if retrieving all products without pagination
    if (!options?.skip && !options?.limit) {
      await this.redisService.set('all_products', products, 300); // Cache for 5 minutes
    }

    return products;
  }

  /**
   * Get a product by ID
   */
  async findById(id: string): Promise<Product> {
    // Try to get from cache
    const cacheKey = `product_${id}`;
    const cachedProduct = await this.redisService.get<Product>(cacheKey);

    if (cachedProduct) {
      return cachedProduct;
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Cache for 5 minutes
    await this.redisService.set(cacheKey, product, 300);

    return product;
  }

  /**
   * Get products by seller ID
   */
  async findBySeller(
    sellerId: string,
    options?: { skip?: number; limit?: number },
  ): Promise<Product[]> {
    return this.productRepository.findBySeller(sellerId, options);
  }

  /**
   * Get products by category ID
   */
  async findByCategory(
    categoryId: string,
    options?: { skip?: number; limit?: number },
  ): Promise<Product[]> {
    return this.productRepository.findByCategory(categoryId, options);
  }

  /**
   * Search products by query
   */
  async search(query: string, options?: { skip?: number; limit?: number }): Promise<Product[]> {
    return this.productRepository.search(query, options);
  }

  /**
   * Get products by status
   */
  async findByStatus(
    status: ProductStatus,
    options?: { skip?: number; limit?: number },
  ): Promise<Product[]> {
    return this.productRepository.findByStatus(status, options);
  }

  /**
   * Get products by geographic location
   */
  async findByLocation(
    location: GeoLocation,
    options?: { skip?: number; limit?: number },
  ): Promise<Product[]> {
    return this.productRepository.findByLocation(location, options);
  }

  /**
   * Create a new product
   */
  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    // Default for images if not provided
    if (!productData.images) {
      productData.images = [];
    }

    // Default for tags if not provided
    if (!productData.tags) {
      productData.tags = [];
    }

    const product = await this.productRepository.create(productData as any);

    // Invalidate cache
    await this.redisService.delete('all_products');

    return product;
  }

  /**
   * Update a product
   */
  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const updatedProduct = await this.productRepository.update(id, productData);

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Invalidate caches
    await this.redisService.delete(`product_${id}`);
    await this.redisService.delete('all_products');

    return updatedProduct;
  }

  /**
   * Delete a product
   */
  async delete(id: string): Promise<Product> {
    const deletedProduct = await this.productRepository.delete(id);

    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Invalidate caches
    await this.redisService.delete(`product_${id}`);
    await this.redisService.delete('all_products');

    return deletedProduct;
  }

  /**
   * Update product status
   */
  async updateStatus(id: string, status: ProductStatus): Promise<Product> {
    const updatedProduct = await this.productRepository.updateStatus(id, status);

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Invalidate caches
    await this.redisService.delete(`product_${id}`);
    await this.redisService.delete('all_products');

    return updatedProduct;
  }

  /**
   * Add an image to a product
   */
  async addImage(id: string, imageUrl: string, isPrimary = false): Promise<Product> {
    const updatedProduct = await this.productRepository.addImage(id, imageUrl, isPrimary);

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Invalidate caches
    await this.redisService.delete(`product_${id}`);
    await this.redisService.delete('all_products');

    return updatedProduct;
  }

  /**
   * Remove an image from a product
   */
  async removeImage(id: string, imageUrl: string): Promise<Product> {
    const updatedProduct = await this.productRepository.removeImage(id, imageUrl);

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Invalidate caches
    await this.redisService.delete(`product_${id}`);
    await this.redisService.delete('all_products');

    return updatedProduct;
  }
}
