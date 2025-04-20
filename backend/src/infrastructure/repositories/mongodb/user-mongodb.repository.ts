import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User as UserEntity, UserRole } from '../../../domain/models/domain-model';
import { User as UserModel, USER_MODEL } from '../../../database/mongodb/schemas/user.schema';
import { UserRepository } from '../../../domain/repositories/user-repository.interface';
import { UserMapper } from '../../mappers/user.mapper';
import { BaseMongoDBRepository } from './base-mongodb.repository';

/**
 * MongoDB implementation of the UserRepository interface
 */
@Injectable()
export class UserMongoDBRepository
  extends BaseMongoDBRepository<UserEntity, UserModel>
  implements UserRepository
{
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserModel>,
    private readonly userMapper: UserMapper,
  ) {
    super(userModel, userMapper);
  }

  /**
   * Find a user by their email address
   * @param email User's email
   * @returns Promise resolving to the user or null if not found
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? this.userMapper.toDomain(user) : null;
  }

  /**
   * Find users by role
   * @param role User role
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of users with the specified role
   */
  async findByRole(
    role: UserRole,
    options?: { skip?: number; limit?: number },
  ): Promise<UserEntity[]> {
    const query = this.userModel.find({ role });

    if (options?.skip !== undefined) {
      query.skip(options.skip);
    }

    if (options?.limit !== undefined) {
      query.limit(options.limit);
    }

    const users = await query.exec();
    return users.map(user => this.userMapper.toDomain(user));
  }

  /**
   * Update user password
   * @param id User ID
   * @param passwordHash New password hash
   * @returns Promise resolving to the updated user or null if not found
   */
  async updatePassword(id: string, passwordHash: string): Promise<UserEntity | null> {
    const updated = await this.userModel
      .findByIdAndUpdate(id, { passwordHash }, { new: true })
      .exec();

    return updated ? this.userMapper.toDomain(updated) : null;
  }
}
