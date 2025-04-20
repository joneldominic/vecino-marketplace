import { Document, FilterQuery, Model, Types } from 'mongoose';
import { BaseRepository } from '../../../domain/repositories/base-repository.interface';
import { BaseMapper } from '../../mappers/base.mapper';

/**
 * Base MongoDB Repository
 *
 * Generic base repository implementation for MongoDB
 */
export abstract class BaseMongoDBRepository<TDomain, TModel extends Document, TId = string>
  implements BaseRepository<TDomain, TId>
{
  constructor(
    protected readonly model: Model<TModel>,
    protected readonly mapper: BaseMapper<TDomain, TModel>,
  ) {}

  /**
   * Find entity by ID
   * @param id Entity ID
   * @returns Promise resolving to the entity or null if not found
   */
  async findById(id: TId): Promise<TDomain | null> {
    // For string IDs, convert to ObjectId
    const objectId = typeof id === 'string' ? new Types.ObjectId(id as string) : id;
    const document = await this.model.findById(objectId).exec();
    return document ? this.mapper.toDomain(document) : null;
  }

  /**
   * Find all entities, optionally with pagination
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of entities
   */
  async findAll(options?: { skip?: number; limit?: number }): Promise<TDomain[]> {
    const query = this.model.find();

    if (options?.skip) {
      query.skip(options.skip);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    const documents = await query.exec();
    return documents.map(doc => this.mapper.toDomain(doc));
  }

  /**
   * Find entities by specified criteria
   * @param criteria Search criteria
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of entities matching criteria
   */
  async findBy(
    criteria: Partial<TDomain>,
    options?: { skip?: number; limit?: number },
  ): Promise<TDomain[]> {
    // Convert domain criteria to persistence criteria
    const persistenceCriteria = this.toPersistenceCriteria(criteria);

    const query = this.model.find(persistenceCriteria as FilterQuery<TModel>);

    if (options?.skip) {
      query.skip(options.skip);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    const documents = await query.exec();
    return documents.map(doc => this.mapper.toDomain(doc));
  }

  /**
   * Count entities matching specified criteria
   * @param criteria Search criteria
   * @returns Promise resolving to the count
   */
  async count(criteria?: Partial<TDomain>): Promise<number> {
    if (!criteria) {
      return this.model.countDocuments().exec();
    }

    // Convert domain criteria to persistence criteria
    const persistenceCriteria = this.toPersistenceCriteria(criteria);
    return this.model.countDocuments(persistenceCriteria as FilterQuery<TModel>).exec();
  }

  /**
   * Create a new entity
   * @param data Entity data
   * @returns Promise resolving to the created entity
   */
  async create(data: Partial<TDomain>): Promise<TDomain> {
    const persistenceData = this.mapper.toPersistence(data as TDomain);
    const savedDocument = await this.model.create(persistenceData);
    return this.mapper.toDomain(savedDocument);
  }

  /**
   * Update an existing entity
   * @param id Entity ID
   * @param data Updated entity data
   * @returns Promise resolving to the updated entity or null if not found
   */
  async update(id: TId, data: Partial<TDomain>): Promise<TDomain | null> {
    // For string IDs, convert to ObjectId
    const objectId = typeof id === 'string' ? new Types.ObjectId(id as string) : id;

    // Convert domain data to persistence data
    const persistenceData = this.mapper.toPersistence(data as TDomain);

    const updatedDocument = await this.model
      .findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
      .exec();

    return updatedDocument ? this.mapper.toDomain(updatedDocument) : null;
  }

  /**
   * Delete an entity by ID
   * @param id Entity ID
   * @returns Promise resolving to the deleted entity or null if not found
   */
  async delete(id: TId): Promise<TDomain | null> {
    // For string IDs, convert to ObjectId
    const objectId = typeof id === 'string' ? new Types.ObjectId(id as string) : id;

    const deletedDocument = await this.model.findByIdAndDelete(objectId).exec();
    return deletedDocument ? this.mapper.toDomain(deletedDocument) : null;
  }

  /**
   * Delete multiple entities by criteria
   * @param criteria Deletion criteria
   * @returns Promise resolving to the number of deleted entities
   */
  async deleteMany(criteria: Partial<TDomain>): Promise<number> {
    // Convert domain criteria to persistence criteria
    const persistenceCriteria = this.toPersistenceCriteria(criteria);

    const result = await this.model.deleteMany(persistenceCriteria as FilterQuery<TModel>).exec();
    return result.deletedCount;
  }

  /**
   * Convert domain criteria to persistence format
   * This method should be overridden by subclasses if custom conversion is needed
   */
  protected toPersistenceCriteria(criteria: Partial<TDomain>): Partial<TModel> {
    // Handle common ID conversion
    if ('id' in criteria) {
      const idCriteria = criteria['id'];
      delete criteria['id'];
      return {
        ...this.mapper.toPersistence(criteria as TDomain),
        _id: typeof idCriteria === 'string' ? new Types.ObjectId(idCriteria as string) : idCriteria,
      } as Partial<TModel>;
    }

    return this.mapper.toPersistence(criteria as TDomain);
  }
}
