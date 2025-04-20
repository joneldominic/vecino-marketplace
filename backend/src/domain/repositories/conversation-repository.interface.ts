import { Conversation, Message } from '../models/domain-model';
import { BaseRepository } from './base-repository.interface';

/**
 * Conversation Repository Interface
 *
 * Extends the base repository with conversation-specific operations.
 */
export interface ConversationRepository extends BaseRepository<Conversation, string> {
  /**
   * Find conversations by participant user ID
   * @param userId User ID
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of conversations the user participates in
   */
  findByParticipant(
    userId: string,
    options?: { skip?: number; limit?: number },
  ): Promise<Conversation[]>;

  /**
   * Find conversations about a specific product
   * @param productId Product ID
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of conversations about the product
   */
  findByProduct(
    productId: string,
    options?: { skip?: number; limit?: number },
  ): Promise<Conversation[]>;

  /**
   * Find or create a conversation between users about a product
   * @param participants Array of participant user IDs
   * @param productId Optional product ID
   * @returns Promise resolving to an existing or new conversation
   */
  findOrCreate(participants: string[], productId?: string): Promise<Conversation>;

  /**
   * Get messages for a conversation
   * @param conversationId Conversation ID
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of messages in the conversation
   */
  getMessages(
    conversationId: string,
    options?: { skip?: number; limit?: number },
  ): Promise<Message[]>;

  /**
   * Add a message to a conversation
   * @param conversationId Conversation ID
   * @param message Message data
   * @returns Promise resolving to the added message
   */
  addMessage(
    conversationId: string,
    message: Omit<Message, 'id' | 'conversationId' | 'createdAt'>,
  ): Promise<Message>;

  /**
   * Mark messages as read
   * @param conversationId Conversation ID
   * @param userId User ID who is marking messages as read
   * @returns Promise resolving to the number of messages marked as read
   */
  markMessagesAsRead(conversationId: string, userId: string): Promise<number>;
}
