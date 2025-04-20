import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ProductsModule } from './modules/products/products.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Database & Infrastructure modules
    DatabaseModule,
    InfrastructureModule,

    // Feature modules
    HealthModule,
    UsersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
