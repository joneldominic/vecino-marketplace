import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule as _DatabaseModule } from './database/database.module';
import { HealthModule as _HealthModule } from './health/health.module';
import { UsersModule as _UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Comment out database modules temporarily for testing the API endpoint
    // DatabaseModule,
    // HealthModule,
    // UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
