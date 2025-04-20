import { RedisService } from '../database/redis/redis.service';
import { Connection } from 'mongoose';
export declare class HealthController {
  private readonly redisService;
  private readonly mongoConnection;
  constructor(redisService: RedisService, mongoConnection: Connection);
  check(): Promise<{
    status: string;
    services: {
      mongodb: string;
      redis: string;
    };
    timestamp: string;
  }>;
}
