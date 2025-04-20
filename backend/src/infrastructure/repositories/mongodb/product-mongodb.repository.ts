import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductRepository } from '../../../domain/repositories/product-repository.interface';
import {
  Product as ProductEntity,
  ProductStatus,
  GeoLocation,
} from '../../../domain/models/domain-model';
import { Product as ProductModel } from '../../../database/mongodb/schemas/product.schema';
import { ProductMapper } from '../../mappers/product.mapper';
import { BaseMongoDBRepository } from './base-mongodb.repository';

/**
 * MongoDB implementation of ProductRepository
 */
@Injectable()
export class ProductMongoDBRepository
  extends BaseMongoDBRepository<ProductEntity, ProductModel>
  implements ProductRepository
{
  constructor(
    @InjectModel(ProductModel.name) productModel: Model<ProductModel>,
    private productMapper: ProductMapper,
  ) {
    super(productModel, productMapper);
  }

  /**
   * Find products by seller ID
   * @param sellerId Seller user ID
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of products from the seller
   */
  async findBySeller(
    sellerId: string,
    options?: { skip?: number; limit?: number },
  ): Promise<ProductEntity[]> {
    const query = this.model.find({
      sellerId: new Types.ObjectId(sellerId),
    });

    if (options?.skip) {
      query.skip(options.skip);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    const products = await query.exec();
    return products.map(product => this.mapper.toDomain(product));
  }

  /**
   * Find products by category ID
   * @param categoryId Category ID
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of products in the category
   */
  async findByCategory(
    categoryId: string,
    options?: { skip?: number; limit?: number },
  ): Promise<ProductEntity[]> {
    const query = this.model.find({
      categoryId: new Types.ObjectId(categoryId),
    });

    if (options?.skip) {
      query.skip(options.skip);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    const products = await query.exec();
    return products.map(product => this.mapper.toDomain(product));
  }

  /**
   * Search products by title, description, or tags
   * @param searchQuery Search query string
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of matching products
   */
  async search(
    searchQuery: string,
    options?: { skip?: number; limit?: number },
  ): Promise<ProductEntity[]> {
    // Using the text index defined in the schema
    const query = this.model.find({
      $text: { $search: searchQuery },
    });

    // Add text score for sorting
    query.sort({ score: { $meta: 'textScore' } });

    if (options?.skip) {
      query.skip(options.skip);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    const products = await query.exec();
    return products.map(product => this.mapper.toDomain(product));
  }

  /**
   * Find products by status
   * @param status Product status
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of products with the specified status
   */
  async findByStatus(
    status: ProductStatus,
    options?: { skip?: number; limit?: number },
  ): Promise<ProductEntity[]> {
    const query = this.model.find({ status });

    if (options?.skip) {
      query.skip(options.skip);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    const products = await query.exec();
    return products.map(product => this.mapper.toDomain(product));
  }

  /**
   * Find products by geographic proximity
   * @param location GeoLocation containing latitude, longitude, and radius
   * @param options Optional pagination parameters
   * @returns Promise resolving to an array of products within the specified radius
   */
  async findByLocation(
    location: GeoLocation,
    options?: { skip?: number; limit?: number },
  ): Promise<ProductEntity[]> {
    // Calculate the radius in radians (MongoDB uses radians for $geoWithin)
    // Earth's radius is approximately 6371 km
    const radiusInKm = location.radius || 10; // Default 10km if not specified
    const radiusInRadians = radiusInKm / 6371;

    const query = this.model.find({
      location: {
        $geoWithin: {
          $centerSphere: [[location.longitude, location.latitude], radiusInRadians],
        },
      },
    });

    if (options?.skip) {
      query.skip(options.skip);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    const products = await query.exec();
    return products.map(product => this.mapper.toDomain(product));
  }

  /**
   * Update product status
   * @param id Product ID
   * @param status New product status
   * @returns Promise resolving to the updated product or null if not found
   */
  async updateStatus(id: string, status: ProductStatus): Promise<ProductEntity | null> {
    const updatedProduct = await this.model
      .findByIdAndUpdate(new Types.ObjectId(id), { $set: { status } }, { new: true })
      .exec();

    return updatedProduct ? this.mapper.toDomain(updatedProduct) : null;
  }

  /**
   * Add a product image
   * @param id Product ID
   * @param imageUrl URL of the image
   * @param isPrimary Whether this image should be the primary image
   * @returns Promise resolving to the updated product or null if not found
   */
  async addImage(id: string, imageUrl: string, isPrimary = false): Promise<ProductEntity | null> {
    // If this image is set as primary, we need to update all other images
    let updateOperation: any;

    if (isPrimary) {
      // First, unset isPrimary flag for all existing images
      await this.model
        .updateOne({ _id: new Types.ObjectId(id) }, { $set: { 'images.$[].isPrimary': false } })
        .exec();

      // Then, add the new image with isPrimary set to true
      updateOperation = {
        $push: {
          images: { url: imageUrl, isPrimary: true },
        },
      };
    } else {
      // Just add the image with isPrimary set to false
      updateOperation = {
        $push: {
          images: { url: imageUrl, isPrimary: false },
        },
      };
    }

    const updatedProduct = await this.model
      .findByIdAndUpdate(new Types.ObjectId(id), updateOperation, { new: true })
      .exec();

    return updatedProduct ? this.mapper.toDomain(updatedProduct) : null;
  }

  /**
   * Remove a product image
   * @param id Product ID
   * @param imageUrl URL of the image to remove
   * @returns Promise resolving to the updated product or null if not found
   */
  async removeImage(id: string, imageUrl: string): Promise<ProductEntity | null> {
    const updatedProduct = await this.model
      .findByIdAndUpdate(
        new Types.ObjectId(id),
        { $pull: { images: { url: imageUrl } } },
        { new: true },
      )
      .exec();

    // If there are still images and no image is marked as primary, set the first one as primary
    const product = await this.model.findById(new Types.ObjectId(id)).exec();
    if (product && product.images.length > 0) {
      const hasPrimary = product.images.some(img => img.isPrimary);

      if (!hasPrimary) {
        // Set the first image as primary
        await this.model
          .updateOne({ _id: new Types.ObjectId(id) }, { $set: { 'images.0.isPrimary': true } })
          .exec();

        // Fetch the updated product
        return this.findById(id);
      }
    }

    return updatedProduct ? this.mapper.toDomain(updatedProduct) : null;
  }
}
