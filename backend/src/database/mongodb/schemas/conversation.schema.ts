import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

/**
 * Message Document - MongoDB representation of a chat message
 */
@Schema({
  timestamps: true,
  collection: 'messages',
})
export class Message extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  })
  conversationId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  senderId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  recipientId: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ type: [String], default: [] })
  attachments?: string[];

  @Prop({ type: Boolean, default: false, index: true })
  read: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Create index for conversation lookup with sorting by createdAt
MessageSchema.index({ conversationId: 1, createdAt: 1 });

// Create compound index for unread messages by recipient
MessageSchema.index({ recipientId: 1, read: 1, createdAt: -1 });

/**
 * Conversation Document - MongoDB representation of a messaging conversation
 */
@Schema({
  timestamps: true,
  collection: 'conversations',
})
export class Conversation extends Document {
  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'User',
    required: true,
    validate: [(val: any[]) => val.length >= 2, 'Conversation must have at least 2 participants'],
  })
  participants: string[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    index: true,
  })
  productId?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Message',
  })
  lastMessageId?: string;

  @Prop({ type: Date, default: Date.now, index: true })
  lastMessageAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Create index for participant lookup
ConversationSchema.index({ participants: 1 });

// Create index for sorting conversations by latest message
ConversationSchema.index({ lastMessageAt: -1 });

// Create compound index for finding a conversation between two users about a product
ConversationSchema.index({ participants: 1, productId: 1 }, { unique: true });

/**
 * Virtual for messages in this conversation
 */
ConversationSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'conversationId',
  options: { sort: { createdAt: 1 } },
});
