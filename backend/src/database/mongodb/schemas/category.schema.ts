import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

/**
 * Category Document - MongoDB representation of a product category
 */
@Schema({
  timestamps: true,
  collection: 'categories',
})
export class Category extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', index: true })
  parentCategoryId?: string;

  @Prop({ type: [String] })
  attributes?: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Add text index for search
CategorySchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 10, description: 5 } },
);

// Add index for parent category lookups
CategorySchema.index({ parentCategoryId: 1 });

/**
 * Virtual for subcategories
 */
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategoryId',
});

/**
 * Check if category is a root category (no parent)
 */
CategorySchema.methods.isRootCategory = function (): boolean {
  return !this.parentCategoryId;
};
