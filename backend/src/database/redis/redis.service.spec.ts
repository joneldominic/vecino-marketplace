import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

jest.mock('ioredis');

describe('RedisService', () => {
  let service: RedisService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('redis://localhost:6379'),
          },
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);

    // Clear all instances and calls to constructor and all methods
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize Redis client with the correct URL', () => {
      service.onModuleInit();

      expect(configService.get).toHaveBeenCalledWith('REDIS_URL', 'redis://localhost:6379');
      expect(Redis).toHaveBeenCalledWith('redis://localhost:6379');
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect Redis client if it exists', () => {
      const mockDisconnect = jest.fn();

      // Set up the Redis client with a mock
      service.onModuleInit();
      const redisClient = service['redisClient'] as jest.Mocked<Redis>;
      redisClient.disconnect = mockDisconnect;

      service.onModuleDestroy();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('CRUD operations', () => {
    beforeEach(() => {
      service.onModuleInit();
    });

    it('should set a value in Redis with TTL when provided', async () => {
      const redisClient = service['redisClient'] as jest.Mocked<Redis>;
      redisClient.setex = jest.fn().mockResolvedValue('OK');

      await service.set('test-key', { foo: 'bar' }, 300);

      expect(redisClient.setex).toHaveBeenCalledWith('test-key', 300, '{"foo":"bar"}');
    });

    it('should set a value in Redis without TTL when not provided', async () => {
      const redisClient = service['redisClient'] as jest.Mocked<Redis>;
      redisClient.set = jest.fn().mockResolvedValue('OK');

      await service.set('test-key', { foo: 'bar' });

      expect(redisClient.set).toHaveBeenCalledWith('test-key', '{"foo":"bar"}');
    });

    it('should get a value from Redis and parse it', async () => {
      const redisClient = service['redisClient'] as jest.Mocked<Redis>;
      redisClient.get = jest.fn().mockResolvedValue('{"foo":"bar"}');

      const result = await service.get<{ foo: string }>('test-key');

      expect(redisClient.get).toHaveBeenCalledWith('test-key');
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should delete a value from Redis', async () => {
      const redisClient = service['redisClient'] as jest.Mocked<Redis>;
      redisClient.del = jest.fn().mockResolvedValue(1);

      await service.delete('test-key');

      expect(redisClient.del).toHaveBeenCalledWith('test-key');
    });

    it('should clear Redis cache', async () => {
      const redisClient = service['redisClient'] as jest.Mocked<Redis>;
      redisClient.flushall = jest.fn().mockResolvedValue('OK');

      await service.clear();

      expect(redisClient.flushall).toHaveBeenCalled();
    });
  });
});
