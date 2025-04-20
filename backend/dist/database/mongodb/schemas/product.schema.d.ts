import { Document, Schema as MongooseSchema } from 'mongoose';
import { ProductStatus, ProductCondition } from '../../../domain/models/domain-model';
export declare class Product extends Document {
    title: string;
    description: string;
    price: Record<string, any>;
    sellerId: string;
    categoryId: string;
    status: ProductStatus;
    condition: ProductCondition;
    location?: Record<string, any>;
    specifications?: Record<string, any>[];
    images: Record<string, any>[];
    tags?: string[];
}
export declare const ProductSchema: MongooseSchema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product> & Product & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>> & import("mongoose").FlatRecord<Product> & {
    _id: import("mongoose").Types.ObjectId;
}>;
