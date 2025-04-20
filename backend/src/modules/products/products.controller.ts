import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product, ProductStatus, GeoLocation } from '../../domain/models/domain-model';

/**
 * Products Controller
 *
 * Handles HTTP requests for product operations
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Get all products with optional pagination
   */
  @Get()
  async findAll(@Query('skip') skip?: number, @Query('limit') limit?: number): Promise<Product[]> {
    return this.productsService.findAll({
      skip: skip ? parseInt(skip as any) : undefined,
      limit: limit ? parseInt(limit as any) : undefined,
    });
  }

  /**
   * Get a product by ID
   */
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Product> {
    try {
      return await this.productsService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  /**
   * Search products by query
   */
  @Get('search/:query')
  async search(
    @Param('query') query: string,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ): Promise<Product[]> {
    return this.productsService.search(query, {
      skip: skip ? parseInt(skip as any) : undefined,
      limit: limit ? parseInt(limit as any) : undefined,
    });
  }

  /**
   * Get products by seller ID
   */
  @Get('seller/:sellerId')
  async findBySeller(
    @Param('sellerId') sellerId: string,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ): Promise<Product[]> {
    return this.productsService.findBySeller(sellerId, {
      skip: skip ? parseInt(skip as any) : undefined,
      limit: limit ? parseInt(limit as any) : undefined,
    });
  }

  /**
   * Get products by category ID
   */
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ): Promise<Product[]> {
    return this.productsService.findByCategory(categoryId, {
      skip: skip ? parseInt(skip as any) : undefined,
      limit: limit ? parseInt(limit as any) : undefined,
    });
  }

  /**
   * Get products by status
   */
  @Get('status/:status')
  async findByStatus(
    @Param('status') status: ProductStatus,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ): Promise<Product[]> {
    return this.productsService.findByStatus(status, {
      skip: skip ? parseInt(skip as any) : undefined,
      limit: limit ? parseInt(limit as any) : undefined,
    });
  }

  /**
   * Get products by geographic location
   */
  @Get('location')
  async findByLocation(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('radius') radius?: number,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ): Promise<Product[]> {
    const location: GeoLocation = {
      latitude: parseFloat(latitude as any),
      longitude: parseFloat(longitude as any),
      radius: radius ? parseFloat(radius as any) : undefined,
    };

    return this.productsService.findByLocation(location, {
      skip: skip ? parseInt(skip as any) : undefined,
      limit: limit ? parseInt(limit as any) : undefined,
    });
  }

  /**
   * Create a new product
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    return this.productsService.create(productData);
  }

  /**
   * Update a product
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() productData: Partial<Product>): Promise<Product> {
    return this.productsService.update(id, productData);
  }

  /**
   * Delete a product
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Product> {
    return this.productsService.delete(id);
  }

  /**
   * Update product status
   */
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ProductStatus,
  ): Promise<Product> {
    return this.productsService.updateStatus(id, status);
  }

  /**
   * Add an image to a product
   */
  @Post(':id/images')
  async addImage(
    @Param('id') id: string,
    @Body('imageUrl') imageUrl: string,
    @Body('isPrimary') isPrimary?: boolean,
  ): Promise<Product> {
    return this.productsService.addImage(id, imageUrl, isPrimary);
  }

  /**
   * Remove an image from a product
   */
  @Delete(':id/images')
  async removeImage(@Param('id') id: string, @Body('imageUrl') imageUrl: string): Promise<Product> {
    return this.productsService.removeImage(id, imageUrl);
  }
}
