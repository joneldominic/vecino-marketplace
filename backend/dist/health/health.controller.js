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
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.HealthController = void 0;
const common_1 = require('@nestjs/common');
const redis_service_1 = require('../database/redis/redis.service');
const mongoose_1 = require('@nestjs/mongoose');
const mongoose_2 = require('mongoose');
let HealthController = class HealthController {
  constructor(redisService, mongoConnection) {
    this.redisService = redisService;
    this.mongoConnection = mongoConnection;
  }
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
      response.services.redis = 'error';
    }
    return response;
  }
};
exports.HealthController = HealthController;
__decorate(
  [
    (0, common_1.Get)(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise),
  ],
  HealthController.prototype,
  'check',
  null,
);
exports.HealthController = HealthController = __decorate(
  [
    (0, common_1.Controller)('health'),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata('design:paramtypes', [redis_service_1.RedisService, mongoose_2.Connection]),
  ],
  HealthController,
);
//# sourceMappingURL=health.controller.js.map
