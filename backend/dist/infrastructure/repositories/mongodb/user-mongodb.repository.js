"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMongoDBRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_mapper_1 = require("../../mappers/user.mapper");
const user_schema_1 = require("../../../database/mongodb/schemas/user.schema");
const base_mongodb_repository_1 = require("./base-mongodb.repository");
let UserMongoDBRepository = class UserMongoDBRepository extends base_mongodb_repository_1.BaseMongoDBRepository {
    constructor(userModel, userMapper) {
        super(userModel, userMapper);
        this.userModel = userModel;
        this.userMapper = userMapper;
    }
    async findByEmail(email) {
        const user = await this.userModel.findOne({ email }).exec();
        return user ? this.mapper.toDomain(user) : null;
    }
    async findByRole(role, options) {
        const query = this.userModel.find({ role });
        if (options?.skip) {
            query.skip(options.skip);
        }
        if (options?.limit) {
            query.limit(options.limit);
        }
        const users = await query.exec();
        return users.map(user => this.mapper.toDomain(user));
    }
    async updatePassword(id, passwordHash) {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, { passwordHash }, { new: true })
            .exec();
        return updatedUser ? this.mapper.toDomain(updatedUser) : null;
    }
};
exports.UserMongoDBRepository = UserMongoDBRepository;
exports.UserMongoDBRepository = UserMongoDBRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_mapper_1.UserMapper])
], UserMongoDBRepository);
//# sourceMappingURL=user-mongodb.repository.js.map