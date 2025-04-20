import { Controller, Get } from '@nestjs/common';
import { RedisService } from '../database/redis/redis.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(
    private readonly redisService: RedisService,
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  @Get()
  async check() {
    const mongoStatus = this.mongoConnection.readyState === 1 ? 'ok' : 'error';
    
    let redisStatus = 'error';
    try {
      const redis = this.redisService.getClient();
      await redis.ping();
      redisStatus = 'ok';
    } catch (error) {
      redisStatus = 'error';
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: mongoStatus,
        redis: redisStatus,
      },
    };
  }
} 