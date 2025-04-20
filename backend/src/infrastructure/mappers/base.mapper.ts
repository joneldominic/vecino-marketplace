/**
 * Base Mapper Interface
 *
 * Generic interface for mapping between domain entities and database models
 */
export interface BaseMapper<DomainEntity, DatabaseModel> {
  /**
   * Maps from database model to domain entity
   * @param model Database model to convert
   * @returns Domain entity representation
   */
  toDomain(model: DatabaseModel): DomainEntity;

  /**
   * Maps from domain entity to database model
   * @param entity Domain entity to convert
   * @returns Database model representation
   */
  toPersistence(entity: DomainEntity): Partial<DatabaseModel>;
}
