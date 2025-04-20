import { Document, Schema as MongooseSchema } from 'mongoose';
import { OrderStatus } from '../../../domain/models/domain-model';
export declare class OrderItem extends Document {
    orderId: string;
    productId: string;
    productSnapshot: Record<string, any>;
    quantity: number;
    unitPrice: Record<string, any>;
    totalPrice: Record<string, any>;
}
export declare const OrderItemSchema: MongooseSchema<OrderItem, import("mongoose").Model<OrderItem, any, any, any, Document<unknown, any, OrderItem> & OrderItem & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrderItem, Document<unknown, {}, import("mongoose").FlatRecord<OrderItem>> & import("mongoose").FlatRecord<OrderItem> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare class Order extends Document {
    buyerId: string;
    sellerId: string;
    status: OrderStatus;
    items: OrderItem[];
    subtotal: Record<string, any>;
    tax: Record<string, any>;
    total: Record<string, any>;
    shippingAddress: Record<string, any>;
    paymentMethod?: string;
    paymentId?: string;
}
export declare const OrderSchema: MongooseSchema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order> & Order & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>> & import("mongoose").FlatRecord<Order> & {
    _id: import("mongoose").Types.ObjectId;
}>;
