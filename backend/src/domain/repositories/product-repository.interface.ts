import { GeoLocation, Product, ProductStatus } from '../models/domain-model';
import { BaseRepository } from './base-repository.interface';

/**
 * Product Repository Interface
 *
 * Extends the base repository with product-specific operations.
 */
export interface ProductRepository extends BaseRepository<Product, string> {
  /**
   * Find products by seller ID
   * @param sellerId Seller user ID
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of products from the seller
   */
  findBySeller(sellerId: string, options?: { skip?: number; limit?: number }): Promise<Product[]>;

  /**
   * Find products by category ID
   * @param categoryId Category ID
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of products in the category
   */
  findByCategory(
    categoryId: string,
    options?: { skip?: number; limit?: number },
  ): Promise<Product[]>;

  /**
   * Search products by title, description, or tags
   * @param query Search query string
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of matching products
   */
  search(query: string, options?: { skip?: number; limit?: number }): Promise<Product[]>;

  /**
   * Find products by status
   * @param status Product status
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of products with the specified status
   */
  findByStatus(
    status: ProductStatus,
    options?: { skip?: number; limit?: number },
  ): Promise<Product[]>;

  /**
   * Find products by geographic proximity
   * @param location GeoLocation containing latitude, longitude, and radius
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of products within the specified radius
   */
  findByLocation(
    location: GeoLocation,
    options?: { skip?: number; limit?: number },
  ): Promise<Product[]>;

  /**
   * Update product status
   * @param id Product ID
   * @param status New product status
   * @returns Promise resolving to the updated product or null if not found
   */
  updateStatus(id: string, status: ProductStatus): Promise<Product | null>;

  /**
   * Add a product image
   * @param id Product ID
   * @param imageUrl URL of the image
   * @param isPrimary Whether this image should be the primary image
   * @returns Promise resolving to the updated product or null if not found
   */
  addImage(id: string, imageUrl: string, isPrimary?: boolean): Promise<Product | null>;

  /**
   * Remove a product image
   * @param id Product ID
   * @param imageUrl URL of the image to remove
   * @returns Promise resolving to the updated product or null if not found
   */
  removeImage(id: string, imageUrl: string): Promise<Product | null>;
}
