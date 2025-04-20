import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { OrderStatus } from '../../../domain/models/domain-model';
import { AddressSchema, MoneySchema } from './common.schema';

/**
 * OrderItem Document - MongoDB representation of an order line item
 */
@Schema({ _id: true, timestamps: false })
export class OrderItem extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true,
  })
  orderId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  })
  productId: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  productSnapshot: Record<string, any>;

  @Prop({ type: Number, required: true, min: 1, default: 1 })
  quantity: number;

  @Prop({ type: MoneySchema, required: true })
  unitPrice: Record<string, any>;

  @Prop({ type: MoneySchema, required: true })
  totalPrice: Record<string, any>;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

/**
 * Order Document - MongoDB representation of an order
 */
@Schema({
  timestamps: true,
  collection: 'orders',
})
export class Order extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  buyerId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  sellerId: string;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.CREATED,
    index: true,
  })
  status: OrderStatus;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ type: MoneySchema, required: true })
  subtotal: Record<string, any>;

  @Prop({ type: MoneySchema, required: true })
  tax: Record<string, any>;

  @Prop({ type: MoneySchema, required: true })
  total: Record<string, any>;

  @Prop({ type: AddressSchema, required: true })
  shippingAddress: Record<string, any>;

  @Prop({ type: String })
  paymentMethod?: string;

  @Prop({ type: String })
  paymentId?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Create index for status and createdAt to find recent orders by status
OrderSchema.index({ status: 1, createdAt: -1 });

// Create compound index for buyer and status for buyer's order history
OrderSchema.index({ buyerId: 1, status: 1, createdAt: -1 });

// Create compound index for seller and status for seller's order history
OrderSchema.index({ sellerId: 1, status: 1, createdAt: -1 });

/**
 * Method to check if order can be cancelled
 */
OrderSchema.methods.canBeCancelled = function (): boolean {
  return [OrderStatus.CREATED, OrderStatus.PAID].includes(this.status);
};

/**
 * Method to check if order can be shipped
 */
OrderSchema.methods.canBeShipped = function (): boolean {
  return this.status === OrderStatus.PAID;
};

/**
 * Method to check if order can be delivered
 */
OrderSchema.methods.canBeDelivered = function (): boolean {
  return this.status === OrderStatus.SHIPPED;
};

/**
 * Method to check if order can be refunded
 */
OrderSchema.methods.canBeRefunded = function (): boolean {
  return [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(this.status);
};
