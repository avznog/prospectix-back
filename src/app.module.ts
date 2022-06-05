import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from "@nestjs/config";
import * as Joi from "@hapi/joi";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
     type: 'postgres',
     host: 'localhost',
     port: 5432,
     username: 'benjamingonzva',
     password: 'postgres',
     database: 'phoenix',
     synchronize: true,
     entities: [User, __dirname + '/**/*.entity{.ts,.js}'],
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // JWT_SECRET: Joi.string(),
        // JWT_EXPIRATION_TIME: Joi.string(),
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
      }),
    }),
    AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
