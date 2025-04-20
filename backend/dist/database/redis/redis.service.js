'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.RedisService = void 0;
const common_1 = require('@nestjs/common');
const config_1 = require('@nestjs/config');
const ioredis_1 = require('ioredis');
let RedisService = class RedisService {
  constructor(configService) {
    this.configService = configService;
  }
  onModuleInit() {
    const redisUrl = this.configService.get('REDIS_URL', 'redis://localhost:6379');
    this.redisClient = new ioredis_1.default(redisUrl);
  }
  onModuleDestroy() {
    if (this.redisClient) {
      this.redisClient.disconnect();
    }
  }
  getClient() {
    return this.redisClient;
  }
  async set(key, value, ttl) {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.redisClient.setex(key, ttl, serialized);
    } else {
      await this.redisClient.set(key, serialized);
    }
  }
  async get(key) {
    try {
      const data = await this.redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (_error) {
      return null;
    }
  }
  async delete(key) {
    await this.redisClient.del(key);
  }
  async clear() {
    await this.redisClient.flushall();
  }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate(
  [(0, common_1.Injectable)(), __metadata('design:paramtypes', [config_1.ConfigService])],
  RedisService,
);
//# sourceMappingURL=redis.service.js.map
