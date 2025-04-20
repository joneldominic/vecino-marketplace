export interface BaseRepository<T, ID> {
    findById(id: ID): Promise<T | null>;
    findAll(options?: {
        skip?: number;
        limit?: number;
    }): Promise<T[]>;
    findBy(criteria: Partial<T>, options?: {
        skip?: number;
        limit?: number;
    }): Promise<T[]>;
    count(criteria?: Partial<T>): Promise<number>;
    create(data: Partial<T>): Promise<T>;
    update(id: ID, data: Partial<T>): Promise<T | null>;
    delete(id: ID): Promise<T | null>;
    deleteMany(criteria: Partial<T>): Promise<number>;
}
