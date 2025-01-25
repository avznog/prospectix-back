import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
