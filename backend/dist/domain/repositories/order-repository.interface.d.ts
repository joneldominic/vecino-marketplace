import { Order, OrderStatus } from '../models/domain-model';
import { BaseRepository } from './base-repository.interface';
export interface OrderRepository extends BaseRepository<Order, string> {
    findByBuyer(buyerId: string, options?: {
        skip?: number;
        limit?: number;
    }): Promise<Order[]>;
    findBySeller(sellerId: string, options?: {
        skip?: number;
        limit?: number;
    }): Promise<Order[]>;
    findByStatus(status: OrderStatus, options?: {
        skip?: number;
        limit?: number;
    }): Promise<Order[]>;
    findByProduct(productId: string, options?: {
        skip?: number;
        limit?: number;
    }): Promise<Order[]>;
    updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
}
