import { Document, Model } from 'mongoose';
import { BaseRepository } from '../../../domain/repositories/base-repository.interface';
import { BaseMapper } from '../../mappers/base.mapper';
export declare abstract class BaseMongoDBRepository<TDomain, TModel extends Document, TId = string> implements BaseRepository<TDomain, TId> {
    protected readonly model: Model<TModel>;
    protected readonly mapper: BaseMapper<TDomain, TModel>;
    constructor(model: Model<TModel>, mapper: BaseMapper<TDomain, TModel>);
    findById(id: TId): Promise<TDomain | null>;
    findAll(options?: {
        skip?: number;
        limit?: number;
    }): Promise<TDomain[]>;
    findBy(criteria: Partial<TDomain>, options?: {
        skip?: number;
        limit?: number;
    }): Promise<TDomain[]>;
    count(criteria?: Partial<TDomain>): Promise<number>;
    create(data: Partial<TDomain>): Promise<TDomain>;
    update(id: TId, data: Partial<TDomain>): Promise<TDomain | null>;
    delete(id: TId): Promise<TDomain | null>;
    deleteMany(criteria: Partial<TDomain>): Promise<number>;
    protected toPersistenceCriteria(criteria: Partial<TDomain>): Partial<TModel>;
}
