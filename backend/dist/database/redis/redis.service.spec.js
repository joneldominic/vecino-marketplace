'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const testing_1 = require('@nestjs/testing');
const config_1 = require('@nestjs/config');
const redis_service_1 = require('./redis.service');
const ioredis_1 = require('ioredis');
jest.mock('ioredis');
describe('RedisService', () => {
  let service;
  let configService;
  beforeEach(async () => {
    const module = await testing_1.Test.createTestingModule({
      providers: [
        redis_service_1.RedisService,
        {
          provide: config_1.ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('redis://localhost:6379'),
          },
        },
      ],
    }).compile();
    service = module.get(redis_service_1.RedisService);
    configService = module.get(config_1.ConfigService);
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('onModuleInit', () => {
    it('should initialize Redis client with the correct URL', () => {
      service.onModuleInit();
      expect(configService.get).toHaveBeenCalledWith('REDIS_URL', 'redis://localhost:6379');
      expect(ioredis_1.default).toHaveBeenCalledWith('redis://localhost:6379');
    });
  });
  describe('onModuleDestroy', () => {
    it('should disconnect Redis client if it exists', () => {
      const mockDisconnect = jest.fn();
      service.onModuleInit();
      const redisClient = service['redisClient'];
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
      const redisClient = service['redisClient'];
      redisClient.setex = jest.fn().mockResolvedValue('OK');
      await service.set('test-key', { foo: 'bar' }, 300);
      expect(redisClient.setex).toHaveBeenCalledWith('test-key', 300, '{"foo":"bar"}');
    });
    it('should set a value in Redis without TTL when not provided', async () => {
      const redisClient = service['redisClient'];
      redisClient.set = jest.fn().mockResolvedValue('OK');
      await service.set('test-key', { foo: 'bar' });
      expect(redisClient.set).toHaveBeenCalledWith('test-key', '{"foo":"bar"}');
    });
    it('should get a value from Redis and parse it', async () => {
      const redisClient = service['redisClient'];
      redisClient.get = jest.fn().mockResolvedValue('{"foo":"bar"}');
      const result = await service.get('test-key');
      expect(redisClient.get).toHaveBeenCalledWith('test-key');
      expect(result).toEqual({ foo: 'bar' });
    });
    it('should delete a value from Redis', async () => {
      const redisClient = service['redisClient'];
      redisClient.del = jest.fn().mockResolvedValue(1);
      await service.delete('test-key');
      expect(redisClient.del).toHaveBeenCalledWith('test-key');
    });
    it('should clear Redis cache', async () => {
      const redisClient = service['redisClient'];
      redisClient.flushall = jest.fn().mockResolvedValue('OK');
      await service.clear();
      expect(redisClient.flushall).toHaveBeenCalled();
    });
  });
});
//# sourceMappingURL=redis.service.spec.js.map
