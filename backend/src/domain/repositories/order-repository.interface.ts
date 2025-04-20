import { Order, OrderStatus } from '../models/domain-model';
import { BaseRepository } from './base-repository.interface';

/**
 * Order Repository Interface
 *
 * Extends the base repository with order-specific operations.
 */
export interface OrderRepository extends BaseRepository<Order, string> {
  /**
   * Find orders by buyer ID
   * @param buyerId Buyer user ID
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of orders placed by the buyer
   */
  findByBuyer(buyerId: string, options?: { skip?: number; limit?: number }): Promise<Order[]>;

  /**
   * Find orders by seller ID
   * @param sellerId Seller user ID
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of orders received by the seller
   */
  findBySeller(sellerId: string, options?: { skip?: number; limit?: number }): Promise<Order[]>;

  /**
   * Find orders by status
   * @param status Order status
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of orders with the specified status
   */
  findByStatus(status: OrderStatus, options?: { skip?: number; limit?: number }): Promise<Order[]>;

  /**
   * Find orders containing a specific product
   * @param productId Product ID
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of orders containing the product
   */
  findByProduct(productId: string, options?: { skip?: number; limit?: number }): Promise<Order[]>;

  /**
   * Update order status
   * @param id Order ID
   * @param status New order status
   * @returns Promise resolving to the updated order or null if not found
   */
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
}
