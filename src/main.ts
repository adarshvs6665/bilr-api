import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BilrLogger } from '@bilr/logger';
import { HttpExceptionFilter } from './filters/http-exception/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@bilr/logger/lib';
import { SERVICE_NAME } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  const logger = app.get(BilrLogger);

  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  await app.listen(port, () => {
    logger.info('App listening on port : ' + port);
  });
}
bootstrap().catch((error) => {
  new Logger({ component: SERVICE_NAME, isProduction: false }).error(
    error.message,
    error,
  );
  process.exit(1);
});
