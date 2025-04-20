import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import * as Redis from 'ioredis';

// Mock Redis client implementation
const mockRedisClient = {
  disconnect: jest.fn().mockResolvedValue(true),
  setex: jest.fn().mockResolvedValue('OK'),
  set: jest.fn().mockResolvedValue('OK'),
  get: jest.fn().mockResolvedValue('{"foo":"bar"}'),
  del: jest.fn().mockResolvedValue(1),
  flushall: jest.fn().mockResolvedValue('OK'),
};

// Mock ioredis constructor
jest.mock('ioredis', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => mockRedisClient),
  };
});

describe('RedisService', () => {
  let service: RedisService;
  let configService: ConfigService;

  beforeEach(async () => {
    jest.clearAllMocks();

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize Redis client with the correct URL', () => {
      // Call onModuleInit manually since Jest doesn't automatically invoke lifecycle hooks
      service.onModuleInit();

      expect(configService.get).toHaveBeenCalledWith('REDIS_URL', 'redis://localhost:6379');
      expect(Redis.default).toHaveBeenCalledWith('redis://localhost:6379');
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect Redis client if it exists', () => {
      // Set up the Redis client first
      service.onModuleInit();
      service.onModuleDestroy();

      expect(mockRedisClient.disconnect).toHaveBeenCalled();
    });
  });

  describe('CRUD operations', () => {
    beforeEach(() => {
      // Ensure Redis client is initialized before each test
      service.onModuleInit();
    });

    it('should set a value in Redis with TTL when provided', async () => {
      await service.set('test-key', { foo: 'bar' }, 300);

      expect(mockRedisClient.setex).toHaveBeenCalledWith('test-key', 300, '{"foo":"bar"}');
    });

    it('should set a value in Redis without TTL when not provided', async () => {
      await service.set('test-key', { foo: 'bar' });

      expect(mockRedisClient.set).toHaveBeenCalledWith('test-key', '{"foo":"bar"}');
    });

    it('should get a value from Redis and parse it', async () => {
      const result = await service.get<{ foo: string }>('test-key');

      expect(mockRedisClient.get).toHaveBeenCalledWith('test-key');
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should delete a value from Redis', async () => {
      await service.delete('test-key');

      expect(mockRedisClient.del).toHaveBeenCalledWith('test-key');
    });

    it('should clear Redis cache', async () => {
      await service.clear();

      expect(mockRedisClient.flushall).toHaveBeenCalled();
    });
  });
});
