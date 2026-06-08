import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');
  app.enableCors({
    origin: [process.env.ORIGIN_URL ?? 'http://localhost:5173'], // Cho phép duy nhất domain của Frontend truy cập
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cho phép gửi cookie/headers nếu cần
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
