import { Module } from '@nestjs/common';
import { MongoDBModule } from './mongodb/mongodb.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [MongoDBModule, RedisModule],
  exports: [MongoDBModule, RedisModule],
})
export class DatabaseModule {} 