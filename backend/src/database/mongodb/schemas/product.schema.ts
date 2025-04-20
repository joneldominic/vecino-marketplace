import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ProductStatus, ProductCondition } from '../../../domain/models/domain-model';
import {
  MoneySchema,
  GeoLocationSchema,
  ImageMetadataSchema,
  ProductSpecificationSchema,
} from './common.schema';

/**
 * Product Document - MongoDB representation of a product listing
 */
@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: MoneySchema, required: true })
  price: Record<string, any>;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  sellerId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  })
  categoryId: string;

  @Prop({
    type: String,
    enum: Object.values(ProductStatus),
    default: ProductStatus.DRAFT,
    index: true,
  })
  status: ProductStatus;

  @Prop({
    type: String,
    enum: Object.values(ProductCondition),
    required: true,
  })
  condition: ProductCondition;

  @Prop({ type: GeoLocationSchema })
  location?: Record<string, any>;

  @Prop({ type: [ProductSpecificationSchema], default: [] })
  specifications?: Record<string, any>[];

  @Prop({ type: [ImageMetadataSchema], default: [] })
  images: Record<string, any>[];

  @Prop({ type: [String], default: [] })
  tags?: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Create text index for search
ProductSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, description: 3 } },
);

// Create compound index for category and status queries
ProductSchema.index({ categoryId: 1, status: 1 });

// Create compound index for seller and status queries
ProductSchema.index({ sellerId: 1, status: 1 });

// Create index for price range queries
ProductSchema.index({ 'price.amount': 1 });

// Create 2dsphere index for geospatial queries if location is present
ProductSchema.index({ 'location.coordinates': '2dsphere' }, { sparse: true });

/**
 * Method to check if product is available for purchase
 */
ProductSchema.methods.isAvailable = function (): boolean {
  return this.status === ProductStatus.ACTIVE;
};

/**
 * Method to get the primary image, or the first image if no primary
 */
ProductSchema.methods.getPrimaryImage = function (): Record<string, any> | null {
  if (!this.images || this.images.length === 0) {
    return null;
  }

  const primaryImage = this.images.find((img: Record<string, any>) => img.isPrimary);
  return primaryImage || this.images[0];
};
