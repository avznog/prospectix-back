import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sentry configuration
  Sentry.init({
    dsn: process.env.SENTRYDSN
  });
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.BASE_URL,
    credentials: true,
  })
  //Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Prospectix API')
    .setDescription('Here is the API for Prospectix')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-api', app, document);
  await app.listen(3000);
}
bootstrap();
