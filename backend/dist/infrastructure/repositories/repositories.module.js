"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoriesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const product_mapper_1 = require("../mappers/product.mapper");
const user_mapper_1 = require("../mappers/user.mapper");
const product_mongodb_repository_1 = require("./mongodb/product-mongodb.repository");
const user_mongodb_repository_1 = require("./mongodb/user-mongodb.repository");
const product_schema_1 = require("../../database/mongodb/schemas/product.schema");
const user_schema_1 = require("../../database/mongodb/schemas/user.schema");
let RepositoriesModule = class RepositoriesModule {
};
exports.RepositoriesModule = RepositoriesModule;
exports.RepositoriesModule = RepositoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: user_schema_1.USER_MODEL, schema: user_schema_1.UserSchema },
            ]),
        ],
        providers: [
            product_mapper_1.ProductMapper,
            user_mapper_1.UserMapper,
            {
                provide: 'ProductRepository',
                useClass: product_mongodb_repository_1.ProductMongoDBRepository,
            },
            {
                provide: 'UserRepository',
                useClass: user_mongodb_repository_1.UserMongoDBRepository,
            },
        ],
        exports: [
            'ProductRepository',
            'UserRepository',
        ],
    })
], RepositoriesModule);
//# sourceMappingURL=repositories.module.js.map