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
exports.UsersController = void 0;
const common_1 = require('@nestjs/common');
const users_service_1 = require('./users.service');
let UsersController = class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }
  async findAll() {
    return this.usersService.findAll();
  }
  async findOne(id) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new common_1.NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  async create(userData) {
    return this.usersService.create(userData);
  }
  async update(id, userData) {
    const updatedUser = await this.usersService.update(id, userData);
    if (!updatedUser) {
      throw new common_1.NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }
  async remove(id) {
    const deletedUser = await this.usersService.remove(id);
    if (!deletedUser) {
      throw new common_1.NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }
};
exports.UsersController = UsersController;
__decorate(
  [
    (0, common_1.Get)(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise),
  ],
  UsersController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', Promise),
  ],
  UsersController.prototype,
  'findOne',
  null,
);
__decorate(
  [
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  UsersController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, Object]),
    __metadata('design:returntype', Promise),
  ],
  UsersController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', Promise),
  ],
  UsersController.prototype,
  'remove',
  null,
);
exports.UsersController = UsersController = __decorate(
  [
    (0, common_1.Controller)('users'),
    __metadata('design:paramtypes', [users_service_1.UsersService]),
  ],
  UsersController,
);
//# sourceMappingURL=users.controller.js.map
