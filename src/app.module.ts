import * as Joi from '@hapi/joi';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';


import { ActionsModule } from './actions/actions.module';
import { AdminModule } from './admin/admin.module';
import { ApisModule } from './apis/apis.module';
import { AuthModule } from './auth/auth.module';
import { GoalsGlobalModule } from './goals-global/goals-global.module';
import { MailsModule } from './mails/mails.module';
import { ProspectGlobalModule } from './prospect-global/prospect-global.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || "localhost",
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE ?? 'persoprospectix',
      synchronize: true,
      autoLoadEntities: true
    }),
    ScheduleModule.forRoot(),
    ActionsModule,
    AdminModule,
    ApisModule,
    AuthModule,
    GoalsGlobalModule,
    MailsModule,
    ProspectGlobalModule,
    UsersModule,
  ],

})
export class AppModule { }