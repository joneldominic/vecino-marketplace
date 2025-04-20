import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { NotificationType } from '../../../domain/models/domain-model';

/**
 * Notification Document - MongoDB representation of a user notification
 */
@Schema({
  timestamps: true,
  collection: 'notifications',
})
export class Notification extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: string;

  @Prop({
    type: String,
    enum: Object.values(NotificationType),
    required: true,
    index: true,
  })
  type: NotificationType;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ type: Boolean, default: false, index: true })
  read: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed })
  data?: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Create compound index for finding unread notifications per user
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

// Create compound index for finding notifications by type per user
NotificationSchema.index({ userId: 1, type: 1, createdAt: -1 });

/**
 * Method to mark notification as read
 */
NotificationSchema.methods.markAsRead = function (): Promise<Notification> {
  this.read = true;
  return this.save();
};

/**
 * Static method to mark all notifications as read for a user
 */
NotificationSchema.statics.markAllAsRead = async function (userId: string): Promise<number> {
  const result = await this.updateMany({ userId, read: false }, { $set: { read: true } });

  return result.nModified || 0;
};
