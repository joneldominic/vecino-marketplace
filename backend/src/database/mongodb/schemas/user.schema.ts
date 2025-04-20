import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../../domain/models/domain-model';
import { AddressSchema } from './common.schema';

/**
 * User Document - MongoDB representation of a user
 */
@Schema({
  timestamps: true,
  collection: 'users',
  toJSON: {
    transform: (_, ret) => {
      delete ret.passwordHash;
      return ret;
    },
  },
})
export class User extends Document {
  @Prop({ required: true, unique: true, index: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({
    required: true,
    enum: Object.values(UserRole),
    default: UserRole.BUYER,
    index: true,
  })
  role: UserRole;

  @Prop({ type: AddressSchema })
  address?: Record<string, any>;

  @Prop({ trim: true })
  phone?: string;
}

// Schema factory to create the User schema
export const UserSchema = SchemaFactory.createForClass(User);

// Add index for email (case insensitive)
UserSchema.index({ email: 1 }, { collation: { locale: 'en', strength: 2 } });

// Create a full-text search index on name
UserSchema.index({ name: 'text' }, { weights: { name: 10 } });

// Create a compound index on role and createdAt for faster role-based queries
UserSchema.index({ role: 1, createdAt: -1 });

/**
 * Method to check if user is admin
 */
UserSchema.methods.isAdmin = function (): boolean {
  return this.role === UserRole.ADMIN;
};

/**
 * Method to check if user is seller
 */
UserSchema.methods.isSeller = function (): boolean {
  return this.role === UserRole.SELLER;
};

/**
 * Method to check if user is buyer
 */
UserSchema.methods.isBuyer = function (): boolean {
  return this.role === UserRole.BUYER;
};
