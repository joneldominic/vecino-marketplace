import { z } from 'zod';
export declare enum ProductCategory {
    ELECTRONICS = "electronics",
    CLOTHING = "clothing",
    HOME = "home",
    BOOKS = "books",
    TOYS = "toys",
    OTHER = "other"
}
export declare enum ProductCondition {
    NEW = "new",
    LIKE_NEW = "like_new",
    GOOD = "good",
    FAIR = "fair",
    POOR = "poor"
}
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    category: z.ZodNativeEnum<typeof ProductCategory>;
    condition: z.ZodNativeEnum<typeof ProductCondition>;
    images: z.ZodArray<z.ZodString, "many">;
    sellerId: z.ZodString;
    location: z.ZodString;
    available: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    condition: ProductCondition;
    images: string[];
    sellerId: string;
    location: string;
    available: boolean;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}, {
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    condition: ProductCondition;
    images: string[];
    sellerId: string;
    location: string;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    available?: boolean | undefined;
}>;
export type Product = z.infer<typeof ProductSchema>;
export declare const CreateProductSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    category: z.ZodNativeEnum<typeof ProductCategory>;
    condition: z.ZodNativeEnum<typeof ProductCondition>;
    images: z.ZodArray<z.ZodString, "many">;
    sellerId: z.ZodString;
    location: z.ZodString;
    available: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "id" | "createdAt" | "updatedAt" | "sellerId">, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    condition: ProductCondition;
    images: string[];
    location: string;
    available: boolean;
}, {
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    condition: ProductCondition;
    images: string[];
    location: string;
    available?: boolean | undefined;
}>;
export type CreateProductRequest = z.infer<typeof CreateProductSchema>;
export declare const UpdateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodNativeEnum<typeof ProductCategory>>;
    condition: z.ZodOptional<z.ZodNativeEnum<typeof ProductCondition>>;
    images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    location: z.ZodOptional<z.ZodString>;
    available: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    category?: ProductCategory | undefined;
    condition?: ProductCondition | undefined;
    images?: string[] | undefined;
    location?: string | undefined;
    available?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    category?: ProductCategory | undefined;
    condition?: ProductCondition | undefined;
    images?: string[] | undefined;
    location?: string | undefined;
    available?: boolean | undefined;
}>;
export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>;
