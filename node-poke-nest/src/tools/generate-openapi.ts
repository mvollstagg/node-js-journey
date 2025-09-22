import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = new DocumentBuilder()
    .setTitle('Node Poke API')
    .setDescription('PokeAPI proxy with NestJS')
    .setVersion('1.0.0')
    .addTag('pokemon')
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  writeFileSync('./openapi.json', JSON.stringify(doc, null, 2), 'utf-8');
  await app.close();
}
generate();
