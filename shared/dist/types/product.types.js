"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductSchema = exports.CreateProductSchema = exports.ProductSchema = exports.ProductCondition = exports.ProductCategory = void 0;
const zod_1 = require("zod");
// Product category enum
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["ELECTRONICS"] = "electronics";
    ProductCategory["CLOTHING"] = "clothing";
    ProductCategory["HOME"] = "home";
    ProductCategory["BOOKS"] = "books";
    ProductCategory["TOYS"] = "toys";
    ProductCategory["OTHER"] = "other";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
// Product condition enum
var ProductCondition;
(function (ProductCondition) {
    ProductCondition["NEW"] = "new";
    ProductCondition["LIKE_NEW"] = "like_new";
    ProductCondition["GOOD"] = "good";
    ProductCondition["FAIR"] = "fair";
    ProductCondition["POOR"] = "poor";
})(ProductCondition || (exports.ProductCondition = ProductCondition = {}));
// Product schema for validation
exports.ProductSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().min(10),
    price: zod_1.z.number().positive(),
    category: zod_1.z.nativeEnum(ProductCategory),
    condition: zod_1.z.nativeEnum(ProductCondition),
    images: zod_1.z.array(zod_1.z.string().url()).min(1).max(10),
    sellerId: zod_1.z.string(),
    location: zod_1.z.string(),
    available: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
// Product create/update request type
exports.CreateProductSchema = exports.ProductSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    sellerId: true,
});
exports.UpdateProductSchema = exports.CreateProductSchema.partial();
//# sourceMappingURL=product.types.js.map