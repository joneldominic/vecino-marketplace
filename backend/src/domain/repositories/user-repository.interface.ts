import { User } from '../models/domain-model';
import { BaseRepository } from './base-repository.interface';

/**
 * User Repository Interface
 *
 * Extends the base repository with user-specific operations.
 */
export interface UserRepository extends BaseRepository<User, string> {
  /**
   * Find a user by their email address
   * @param email User's email
   * @returns Promise resolving to the user or null if not found
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find users by role
   * @param role User role
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of users with the specified role
   */
  findByRole(role: User['role'], options?: { skip?: number; limit?: number }): Promise<User[]>;

  /**
   * Change user password
   * @param id User ID
   * @param passwordHash New password hash
   * @returns Promise resolving to the updated user or null if not found
   */
  updatePassword(id: string, passwordHash: string): Promise<User | null>;
}
