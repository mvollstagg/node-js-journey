import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,          // class-transformer çalışsın
    whitelist: true,          // DTO’da olmayan field'ları at
    forbidNonWhitelisted: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Node Poke API')
    .setDescription('PokeAPI proxy with NestJS')
    .setVersion('1.0.0')
    .addTag('pokemon')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document); // Swagger UI

  // İstersen build sırasında dosyaya da yazabiliriz:
  // import { writeFileSync } from 'node:fs';
  // writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
  console.log(`HTTP listening on :${port} (docs at /docs)`);
}
bootstrap();
