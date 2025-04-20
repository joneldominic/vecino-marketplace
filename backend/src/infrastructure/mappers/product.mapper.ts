import { Injectable } from '@nestjs/common';
import {
  Product as ProductEntity,
  Money,
  GeoLocation,
  ProductSpecification,
  ImageMetadata,
} from '../../domain/models/domain-model';
import { Product as ProductModel } from '../../database/mongodb/schemas/product.schema';
import { BaseMapper } from './base.mapper';
import { Types } from 'mongoose';

/**
 * Product Mapper
 *
 * Handles the conversion between domain Product entities and MongoDB Product documents
 */
@Injectable()
export class ProductMapper implements BaseMapper<ProductEntity, ProductModel> {
  /**
   * Maps from MongoDB document to domain entity
   * @param model MongoDB product document
   * @returns Domain product entity
   */
  toDomain(model: ProductModel): ProductEntity {
    if (!model) {
      return {} as ProductEntity;
    }

    // Extract the MongoDB document properties
    const {
      _id,
      title,
      description,
      price,
      sellerId,
      categoryId,
      status,
      condition,
      location,
      specifications,
      images,
      tags,
    } = model;

    // Get timestamps from the model
    const timestamp = model.toObject ? model.toObject() : model;
    const createdAt = timestamp.createdAt;
    const updatedAt = timestamp.updatedAt;

    // Convert MongoDB _id to string format
    const id = _id.toString();

    return {
      id,
      title,
      description,
      price: this.convertToMoney(price),
      sellerId: this.getIdAsString(sellerId),
      categoryId: this.getIdAsString(categoryId),
      status,
      condition,
      location: location ? this.convertToGeoLocation(location) : undefined,
      specifications: specifications ? this.convertToSpecifications(specifications) : undefined,
      images: this.convertToImages(images),
      tags: tags || [],
      createdAt,
      updatedAt,
    };
  }

  /**
   * Maps from domain entity to MongoDB document
   * @param entity Domain product entity
   * @returns MongoDB product document data
   */
  toPersistence(entity: ProductEntity): Partial<ProductModel> {
    if (!entity) {
      return {};
    }

    const result: Partial<ProductModel> = {
      ...(entity.id && { _id: this.convertToObjectId(entity.id) }),
      title: entity.title,
      description: entity.description,
      price: entity.price,
      status: entity.status,
      condition: entity.condition,
      location: entity.location,
      specifications: entity.specifications,
      images: entity.images,
      tags: entity.tags,
    };

    // Handle sellerId and categoryId separately to ensure correct types
    if (entity.sellerId) {
      const sellerObjectId = this.convertToObjectId(entity.sellerId);
      if (sellerObjectId) {
        result.sellerId = entity.sellerId;
      }
    }

    if (entity.categoryId) {
      const categoryObjectId = this.convertToObjectId(entity.categoryId);
      if (categoryObjectId) {
        result.categoryId = entity.categoryId;
      }
    }

    return result;
  }

  /**
   * Helper method to convert string IDs to MongoDB ObjectIds
   */
  private convertToObjectId(id: string): Types.ObjectId | null {
    if (!id) return null;

    // Check if the ID is already a valid ObjectId
    return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
  }

  /**
   * Helper method to convert MongoDB Money document to domain Money entity
   */
  private convertToMoney(moneyDoc: Record<string, any>): Money {
    if (!moneyDoc) {
      return { amount: 0, currency: 'PHP' };
    }
    return {
      amount: moneyDoc.amount,
      currency: moneyDoc.currency,
    };
  }

  /**
   * Helper method to convert MongoDB GeoLocation document to domain GeoLocation entity
   */
  private convertToGeoLocation(locationDoc: Record<string, any>): GeoLocation {
    if (!locationDoc) {
      return { latitude: 0, longitude: 0 };
    }
    return {
      latitude: locationDoc.latitude,
      longitude: locationDoc.longitude,
      radius: locationDoc.radius,
    };
  }

  /**
   * Helper method to convert MongoDB ProductSpecification documents to domain ProductSpecification entities
   */
  private convertToSpecifications(specsDoc: Record<string, any>[]): ProductSpecification[] {
    if (!specsDoc || !Array.isArray(specsDoc)) return [];
    return specsDoc.map(spec => ({
      key: spec.key,
      value: spec.value,
      unit: spec.unit,
    }));
  }

  /**
   * Helper method to convert MongoDB ImageMetadata documents to domain ImageMetadata entities
   */
  private convertToImages(imagesDoc: Record<string, any>[]): ImageMetadata[] {
    if (!imagesDoc || !Array.isArray(imagesDoc)) return [];
    return imagesDoc.map(image => ({
      url: image.url,
      alt: image.alt,
      width: image.width,
      height: image.height,
      isPrimary: image.isPrimary,
    }));
  }

  /**
   * Helper method to get ID as string regardless of type (ObjectId or string)
   */
  private getIdAsString(id: any): string {
    if (!id) return '';
    if (typeof id === 'object' && id.toString) return id.toString();
    return String(id);
  }
}
