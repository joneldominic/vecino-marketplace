import { Injectable } from '@nestjs/common';
import { User as UserEntity, Address } from '../../domain/models/domain-model';
import { User as UserModel } from '../../database/mongodb/schemas/user.schema';
import { BaseMapper } from './base.mapper';

/**
 * User Mapper
 *
 * Maps between User domain entities and MongoDB documents
 */
@Injectable()
export class UserMapper implements BaseMapper<UserEntity, UserModel> {
  /**
   * Maps from database model to domain entity
   * @param model Database model to convert
   * @returns Domain entity representation
   */
  toDomain(model: UserModel): UserEntity {
    const { _id, email, name, passwordHash, role, address, phone } = model;

    // Extract createdAt and updatedAt from the document with proper type assertion
    const timestamp = model.toObject();

    return {
      id: _id.toString(),
      email,
      name,
      passwordHash,
      role,
      address: address as Address,
      phone,
      createdAt: timestamp.createdAt,
      updatedAt: timestamp.updatedAt,
    };
  }

  /**
   * Maps from domain entity to database model
   * @param entity Domain entity to convert
   * @returns Database model representation
   */
  toPersistence(entity: Partial<UserEntity>): Partial<UserModel> {
    const persistenceModel: Partial<UserModel> = {};

    // Handle only defined properties
    if (entity.email !== undefined) persistenceModel.email = entity.email;
    if (entity.name !== undefined) persistenceModel.name = entity.name;
    if (entity.passwordHash !== undefined) persistenceModel.passwordHash = entity.passwordHash;
    if (entity.role !== undefined) persistenceModel.role = entity.role;
    if (entity.address !== undefined) persistenceModel.address = entity.address;
    if (entity.phone !== undefined) persistenceModel.phone = entity.phone;

    return persistenceModel;
  }
}
