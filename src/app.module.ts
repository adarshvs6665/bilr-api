import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BilrLoggerModule } from '@bilr/logger';
import { ReqLoggerMiddleware } from './middlewares/req-logger/req-logger.middleware';
import { SERVICE_NAME } from './constants';

@Module({
  imports: [
    BilrLoggerModule.forRoot({
      component: SERVICE_NAME,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReqLoggerMiddleware).forRoutes('*');
  }
}
