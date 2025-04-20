import { z } from 'zod';

// Product category enum
export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  HOME = 'home',
  BOOKS = 'books',
  TOYS = 'toys',
  OTHER = 'other',
}

// Product condition enum
export enum ProductCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
}

// Product schema for validation
export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(100),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.nativeEnum(ProductCategory),
  condition: z.nativeEnum(ProductCondition),
  images: z.array(z.string().url()).min(1).max(10),
  sellerId: z.string(),
  location: z.string(),
  available: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Product type derived from schema
export type Product = z.infer<typeof ProductSchema>;

// Product create/update request type
export const CreateProductSchema = ProductSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  sellerId: true,
});

export type CreateProductRequest = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();

export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>; 