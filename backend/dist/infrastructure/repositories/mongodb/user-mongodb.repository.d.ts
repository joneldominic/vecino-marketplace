import { Model } from 'mongoose';
import { User } from '../../../domain/models/domain-model';
import { UserRepository } from '../../../domain/repositories/user-repository.interface';
import { UserMapper } from '../../mappers/user.mapper';
import { User as UserModel } from '../../../database/mongodb/schemas/user.schema';
import { BaseMongoDBRepository } from './base-mongodb.repository';
import { UserRole } from '../../../domain/models/domain-model';
export declare class UserMongoDBRepository extends BaseMongoDBRepository<User, UserModel> implements UserRepository {
    private userModel;
    private userMapper;
    constructor(userModel: Model<UserModel>, userMapper: UserMapper);
    findByEmail(email: string): Promise<User | null>;
    findByRole(role: UserRole, options?: {
        skip?: number;
        limit?: number;
    }): Promise<User[]>;
    updatePassword(id: string, passwordHash: string): Promise<User | null>;
}
