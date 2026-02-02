import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { corsConfig } from './config/corsConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig);
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Digital Asset Manager API')
    .setDescription('The Digital Asset Manager API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  await app.listen(process.env.PORT ?? 3009);
}
void bootstrap();
