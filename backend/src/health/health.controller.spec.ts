import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { RedisService } from '../database/redis/redis.service';
import { getConnectionToken } from '@nestjs/mongoose';

describe('HealthController', () => {
  let controller: HealthController;
  let redisService: RedisService;

  beforeEach(async () => {
    const redisClientMock = {
      ping: jest.fn().mockResolvedValue('PONG'),
    };

    const redisServiceMock = {
      getClient: jest.fn().mockReturnValue(redisClientMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: RedisService,
          useValue: redisServiceMock,
        },
        {
          provide: getConnectionToken(),
          useValue: { readyState: 1 },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health check with all services ok', async () => {
    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.services.mongodb).toBe('ok');
    expect(result.services.redis).toBe('ok');
    expect(result.timestamp).toBeDefined();
  });

  it('should return redis error when redis ping fails', async () => {
    const redis = redisService.getClient();
    jest.spyOn(redis, 'ping').mockRejectedValueOnce(new Error('Connection failed'));

    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.services.mongodb).toBe('ok');
    expect(result.services.redis).toBe('error');
  });
});
