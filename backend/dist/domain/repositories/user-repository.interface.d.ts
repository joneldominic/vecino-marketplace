import { User } from '../models/domain-model';
import { BaseRepository } from './base-repository.interface';
export interface UserRepository extends BaseRepository<User, string> {
    findByEmail(email: string): Promise<User | null>;
    findByRole(role: User['role'], options?: {
        skip?: number;
        limit?: number;
    }): Promise<User[]>;
    updatePassword(id: string, passwordHash: string): Promise<User | null>;
}
