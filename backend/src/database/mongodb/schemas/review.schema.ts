import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

/**
 * Review Document - MongoDB representation of a product review
 */
@Schema({
  timestamps: true,
  collection: 'reviews',
})
export class Review extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  })
  productId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  reviewerId: string;

  @Prop({
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer between 1 and 5',
    },
  })
  rating: number;

  @Prop({ trim: true })
  title?: string;

  @Prop({ trim: true })
  comment?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Create compound index for product and reviewer (one review per user per product)
ReviewSchema.index({ productId: 1, reviewerId: 1 }, { unique: true });

// Create index for rating stats by product
ReviewSchema.index({ productId: 1, rating: 1 });

// Create text index for searching reviews
ReviewSchema.index({ title: 'text', comment: 'text' });

/**
 * Static method to calculate average rating for a product
 */
ReviewSchema.statics.calculateAverageRating = async function (productId: string): Promise<number> {
  const result = await this.aggregate([
    { $match: { productId: new MongooseSchema.Types.ObjectId(productId) } },
    { $group: { _id: '$productId', avgRating: { $avg: '$rating' } } },
  ]);

  return result.length > 0 ? result[0].avgRating : 0;
};
