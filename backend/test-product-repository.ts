import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './src/app.module';
import { ProductsService } from './src/modules/products/products.service';
import { ProductStatus, ProductCondition } from './src/domain/models/domain-model';

/**
 * Test script to verify the product repository implementation
 */
async function bootstrap() {
  const logger = new Logger('ProductRepositoryTest');
  logger.log('Starting test for Product Repository implementation...');

  // Create NestJS application
  const app = await NestFactory.create(AppModule);

  // Get the products service
  const productsService = app.get(ProductsService);

  // Test product creation
  logger.log('Testing product creation...');
  const newProduct = await productsService.create({
    title: 'Test Product',
    description: 'This is a test product created by the repository test script',
    price: {
      amount: 1000,
      currency: 'PHP',
    },
    sellerId: '60d21b4667d0d8992e610c85', // Mock seller ID
    categoryId: '60d21b4667d0d8992e610c90', // Mock category ID
    status: ProductStatus.DRAFT,
    condition: ProductCondition.NEW,
    images: [
      {
        url: 'https://example.com/test-image.jpg',
        alt: 'Test image',
        isPrimary: true,
      },
    ],
    tags: ['test', 'repository', 'implementation'],
  });

  logger.log(`Created product: ${JSON.stringify(newProduct, null, 2)}`);

  // Test product retrieval
  logger.log(`Testing product retrieval by ID: ${newProduct.id}...`);
  const retrievedProduct = await productsService.findById(newProduct.id);
  logger.log(`Retrieved product: ${JSON.stringify(retrievedProduct, null, 2)}`);

  // Test product update
  logger.log('Testing product update...');
  const updatedProduct = await productsService.update(newProduct.id, {
    title: 'Updated Test Product',
    description: 'This product has been updated by the repository test script',
  });
  logger.log(`Updated product: ${JSON.stringify(updatedProduct, null, 2)}`);

  // Test status update
  logger.log('Testing product status update...');
  const activeProduct = await productsService.updateStatus(newProduct.id, ProductStatus.ACTIVE);
  logger.log(`Product with updated status: ${JSON.stringify(activeProduct, null, 2)}`);

  // Test adding an image
  logger.log('Testing adding an image to product...');
  const productWithNewImage = await productsService.addImage(
    newProduct.id,
    'https://example.com/test-image-2.jpg',
    false,
  );
  logger.log(`Product with new image: ${JSON.stringify(productWithNewImage, null, 2)}`);

  // Test searching
  logger.log('Testing product search...');
  const searchResults = await productsService.search('test');
  logger.log(`Search results: ${JSON.stringify(searchResults, null, 2)}`);

  // Test deletion
  logger.log(`Testing product deletion: ${newProduct.id}...`);
  const deletedProduct = await productsService.delete(newProduct.id);
  logger.log(`Deleted product: ${JSON.stringify(deletedProduct, null, 2)}`);

  // Verify deletion
  logger.log('Verifying product deletion...');
  try {
    await productsService.findById(newProduct.id);
    logger.error('Product was not deleted properly!');
  } catch (error) {
    // Properly log the error or just ignore it since this is expected
    logger.log('Product was deleted successfully!', error.message);
  }

  // Clean up
  await app.close();
  logger.log('Test completed!');
}

bootstrap().catch(error => {
  console.error('Test failed with error:', error);
});
