import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { RedisModule } from '../../database/redis/redis.module';

/**
 * Products Module
 */
@Module({
  imports: [InfrastructureModule, RedisModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
