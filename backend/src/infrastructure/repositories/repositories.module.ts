import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductMapper } from '../mappers/product.mapper';
import { UserMapper } from '../mappers/user.mapper';
import { ProductMongoDBRepository } from './mongodb/product-mongodb.repository';
import { UserMongoDBRepository } from './mongodb/user-mongodb.repository';
import { Product, ProductSchema } from '../../database/mongodb/schemas/product.schema';
import { USER_MODEL, UserSchema } from '../../database/mongodb/schemas/user.schema';

/**
 * Repositories Module
 *
 * Registers all repository implementations and their dependencies
 */
@Module({
  imports: [
    // Register MongoDB schemas
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: USER_MODEL, schema: UserSchema },
    ]),
  ],
  providers: [
    // Register mappers
    ProductMapper,
    UserMapper,

    // Register repositories
    {
      provide: 'ProductRepository',
      useClass: ProductMongoDBRepository,
    },
    {
      provide: 'UserRepository',
      useClass: UserMongoDBRepository,
    },
  ],
  exports: [
    // Export repositories for use in other modules
    'ProductRepository',
    'UserRepository',
  ],
})
export class RepositoriesModule {}
