export interface BaseMapper<DomainEntity, DatabaseModel> {
    toDomain(model: DatabaseModel): DomainEntity;
    toPersistence(entity: DomainEntity): Partial<DatabaseModel>;
}
