import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BilrLogger } from '@bilr/logger';
import { HttpExceptionFilter } from './filters/http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(BilrLogger);
  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  await app.listen(3000, () => {
    logger.info('App listening on port 3000');
  });
}
bootstrap();
