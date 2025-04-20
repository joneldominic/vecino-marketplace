/**
 * Base Repository Interface
 *
 * Defines the standard operations to be implemented by all repositories.
 */

export interface BaseRepository<T, ID> {
  /**
   * Find entity by ID
   * @param id Entity ID
   * @returns Promise resolving to the entity or null if not found
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Find all entities, optionally with pagination
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of entities
   */
  findAll(options?: { skip?: number; limit?: number }): Promise<T[]>;

  /**
   * Find entities by specified criteria
   * @param criteria Search criteria
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of entities matching criteria
   */
  findBy(criteria: Partial<T>, options?: { skip?: number; limit?: number }): Promise<T[]>;

  /**
   * Count entities matching specified criteria
   * @param criteria Search criteria
   * @returns Promise resolving to the count
   */
  count(criteria?: Partial<T>): Promise<number>;

  /**
   * Create a new entity
   * @param data Entity data
   * @returns Promise resolving to the created entity
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Update an existing entity
   * @param id Entity ID
   * @param data Updated entity data
   * @returns Promise resolving to the updated entity or null if not found
   */
  update(id: ID, data: Partial<T>): Promise<T | null>;

  /**
   * Delete an entity by ID
   * @param id Entity ID
   * @returns Promise resolving to the deleted entity or null if not found
   */
  delete(id: ID): Promise<T | null>;

  /**
   * Delete multiple entities by criteria
   * @param criteria Deletion criteria
   * @returns Promise resolving to the number of deleted entities
   */
  deleteMany(criteria: Partial<T>): Promise<number>;
}
