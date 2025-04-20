import { Conversation, Message } from '../models/domain-model';
import { BaseRepository } from './base-repository.interface';
export interface ConversationRepository extends BaseRepository<Conversation, string> {
    findByParticipant(userId: string, options?: {
        skip?: number;
        limit?: number;
    }): Promise<Conversation[]>;
    findByProduct(productId: string, options?: {
        skip?: number;
        limit?: number;
    }): Promise<Conversation[]>;
    findOrCreate(participants: string[], productId?: string): Promise<Conversation>;
    getMessages(conversationId: string, options?: {
        skip?: number;
        limit?: number;
    }): Promise<Message[]>;
    addMessage(conversationId: string, message: Omit<Message, 'id' | 'conversationId' | 'createdAt'>): Promise<Message>;
    markMessagesAsRead(conversationId: string, userId: string): Promise<number>;
}
