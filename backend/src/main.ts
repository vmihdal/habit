import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

console.log(process.env.JWT_SECRET);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Habit Tracker API')
    .setDescription('The Habit Tracker API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  
  // CORS configuration
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174'
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  await app.listen(3001);
}
bootstrap(); 