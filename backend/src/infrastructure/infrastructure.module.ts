import { Module } from '@nestjs/common';
import { MongoDBModule } from '../database/mongodb/mongodb.module';
import { RepositoriesModule } from './repositories/repositories.module';

/**
 * Infrastructure Module
 *
 * Aggregates all infrastructure components (repositories, mappers, etc.)
 */
@Module({
  imports: [
    // Import database modules
    MongoDBModule,

    // Import repositories
    RepositoriesModule,
  ],
  exports: [
    // Export repositories for use in other modules
    RepositoriesModule,
  ],
})
export class InfrastructureModule {}
