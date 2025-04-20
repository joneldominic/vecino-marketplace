import { User as UserEntity } from '../../domain/models/domain-model';
import { User as UserModel } from '../../database/mongodb/schemas/user.schema';
import { BaseMapper } from './base.mapper';
export declare class UserMapper implements BaseMapper<UserEntity, UserModel> {
    toDomain(model: UserModel): UserEntity;
    toPersistence(entity: Partial<UserEntity>): Partial<UserModel>;
}
