'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('@nestjs/core');
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const app_module_1 = require('./app.module');
async function bootstrap() {
  const app = await core_1.NestFactory.create(app_module_1.AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
  app.enableCors();
  const config = new swagger_1.DocumentBuilder()
    .setTitle('Vecino Marketplace API')
    .setDescription('API documentation for Vecino Marketplace')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = swagger_1.SwaggerModule.createDocument(app, config);
  swagger_1.SwaggerModule.setup('api/docs', app, document);
  await app.listen(4000);
  console.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
