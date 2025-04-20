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
exports.UsersService = void 0;
const common_1 = require('@nestjs/common');
const mongoose_1 = require('@nestjs/mongoose');
const mongoose_2 = require('mongoose');
const user_schema_1 = require('./schemas/user.schema');
const redis_service_1 = require('../database/redis/redis.service');
let UsersService = class UsersService {
  constructor(userModel, redisService) {
    this.userModel = userModel;
    this.redisService = redisService;
  }
  async findAll() {
    const cachedUsers = await this.redisService.get('all_users');
    if (cachedUsers) {
      return cachedUsers;
    }
    const users = await this.userModel.find().exec();
    await this.redisService.set('all_users', users, 300);
    return users;
  }
  async findOne(id) {
    const cacheKey = `user_${id}`;
    const cachedUser = await this.redisService.get(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userModel.findById(id).exec();
    if (user) {
      await this.redisService.set(cacheKey, user, 300);
    }
    return user;
  }
  async findByEmail(email) {
    return this.userModel.findOne({ email }).exec();
  }
  async create(userData) {
    const newUser = new this.userModel(userData);
    const savedUser = await newUser.save();
    await this.redisService.delete('all_users');
    return savedUser;
  }
  async update(id, userData) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
    if (updatedUser) {
      const cacheKey = `user_${id}`;
      await this.redisService.set(cacheKey, updatedUser, 300);
      await this.redisService.delete('all_users');
    }
    return updatedUser;
  }
  async remove(id) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (deletedUser) {
      const cacheKey = `user_${id}`;
      await this.redisService.delete(cacheKey);
      await this.redisService.delete('all_users');
    }
    return deletedUser;
  }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata('design:paramtypes', [mongoose_2.Model, redis_service_1.RedisService]),
  ],
  UsersService,
);
//# sourceMappingURL=users.service.js.map
