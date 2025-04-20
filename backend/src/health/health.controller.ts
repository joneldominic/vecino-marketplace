/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
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
    const response = {
      status: 'ok',
      services: {
        mongodb: this.mongoConnection.readyState === 1 ? 'ok' : 'error',
        redis: 'ok',
      },
      timestamp: new Date().toISOString(),
    };

    try {
      await this.redisService.getClient().ping();
    } catch (_error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      response.services.redis = 'error';
    }

    return response;
  }
}
