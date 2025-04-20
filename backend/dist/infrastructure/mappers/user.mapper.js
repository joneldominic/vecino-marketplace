"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const common_1 = require("@nestjs/common");
let UserMapper = class UserMapper {
    toDomain(model) {
        const { _id, email, name, passwordHash, role, address, phone } = model;
        const timestamp = model.toObject();
        return {
            id: _id.toString(),
            email,
            name,
            passwordHash,
            role,
            address: address,
            phone,
            createdAt: timestamp.createdAt,
            updatedAt: timestamp.updatedAt,
        };
    }
    toPersistence(entity) {
        const persistenceModel = {};
        if (entity.email !== undefined)
            persistenceModel.email = entity.email;
        if (entity.name !== undefined)
            persistenceModel.name = entity.name;
        if (entity.passwordHash !== undefined)
            persistenceModel.passwordHash = entity.passwordHash;
        if (entity.role !== undefined)
            persistenceModel.role = entity.role;
        if (entity.address !== undefined)
            persistenceModel.address = entity.address;
        if (entity.phone !== undefined)
            persistenceModel.phone = entity.phone;
        return persistenceModel;
    }
};
exports.UserMapper = UserMapper;
exports.UserMapper = UserMapper = __decorate([
    (0, common_1.Injectable)()
], UserMapper);
//# sourceMappingURL=user.mapper.js.map