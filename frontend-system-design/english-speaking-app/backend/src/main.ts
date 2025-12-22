import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Cookie parser for auth tokens
    app.use(cookieParser());

    // Enable CORS for frontend
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
    });

    // Validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    // Swagger API docs
    const config = new DocumentBuilder()
        .setTitle('English Speaking App API')
        .setDescription('API for voice rooms and AI practice')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3002);
    console.log('🚀 Backend running on http://localhost:3002');
    console.log('📚 API docs at http://localhost:3002/api');
}
bootstrap();
