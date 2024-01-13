import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BilrLogger } from '@bilr/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(BilrLogger));

  await app.listen(3000);
}
bootstrap();
