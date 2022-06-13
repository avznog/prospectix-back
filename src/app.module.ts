import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth/entities/auth.entity';
import { ProjectManagersModule } from './project-managers/project-managers.module';
import { ProjectManager } from './project-managers/entities/project-manager.entity';
import { Prospect } from './prospects/entities/prospect.entity';
import { Reminder } from './reminders/entities/reminder.entity';
import { ProspectsModule } from './prospects/prospects.module';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  imports: [
    AuthModule,
    ProjectManagersModule,
    ProspectsModule,
    RemindersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: +process.env.POSTGRES_PORT || 5432,
      username: process.env.POSTGRES_USER || 'benjamingonzva',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'testnew',
      synchronize: true,
      entities: [Auth, ProjectManager, Prospect, Reminder],
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
