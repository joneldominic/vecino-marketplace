'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const testing_1 = require('@nestjs/testing');
const health_controller_1 = require('./health.controller');
const redis_service_1 = require('../database/redis/redis.service');
const mongoose_1 = require('@nestjs/mongoose');
describe('HealthController', () => {
  let controller;
  let redisService;
  beforeEach(async () => {
    const redisClientMock = {
      ping: jest.fn().mockResolvedValue('PONG'),
    };
    const redisServiceMock = {
      getClient: jest.fn().mockReturnValue(redisClientMock),
    };
    const module = await testing_1.Test.createTestingModule({
      controllers: [health_controller_1.HealthController],
      providers: [
        {
          provide: redis_service_1.RedisService,
          useValue: redisServiceMock,
        },
        {
          provide: (0, mongoose_1.getConnectionToken)(),
          useValue: { readyState: 1 },
        },
      ],
    }).compile();
    controller = module.get(health_controller_1.HealthController);
    redisService = module.get(redis_service_1.RedisService);
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
//# sourceMappingURL=health.controller.spec.js.map
