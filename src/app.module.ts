import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BilrLoggerModule } from '@bilr/logger';
import { ReqLoggerMiddleware } from './middlewares/req-logger/req-logger.middleware';
import { SERVICE_NAME } from './constants';
import { ReqCorrelationIdMiddleware } from './middlewares/req-correlation-id/req-correlation-id.middleware';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    BilrLoggerModule.forRoot({
      component: SERVICE_NAME,
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReqCorrelationIdMiddleware).forRoutes('*');
    consumer.apply(ReqLoggerMiddleware).forRoutes('*');
  }
}
