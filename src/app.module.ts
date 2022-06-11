import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import * as Joi from "@hapi/joi";
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './app-data-source';
import { Cdp } from './cdp/entities/cdp.entity';
import { Auth } from './auth/entities/auth.entity';
import { User } from './user/entities/user.entity';
import { CdpModule } from './cdp/cdp.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CdpModule,
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: +process.env.POSTGRES_PORT || 5432,
      username: process.env.POSTGRES_USER || 'benjamingonzva',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'prospectix_auth',
      synchronize: true,
      entities: [Auth, Cdp, User],
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
