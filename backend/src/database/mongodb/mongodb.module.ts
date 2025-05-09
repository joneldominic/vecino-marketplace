import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/vecino-marketplace',
        ),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class MongoDBModule {}
