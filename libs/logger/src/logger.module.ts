import { DynamicModule, Global, Module } from '@nestjs/common';
import { BilrLogger } from './logger.service';
import { BILR_LOGGER_MODULE_OPTIONS, BilrLoggerModulesOptions } from './lib';

@Global()
@Module({})
export class BilrLoggerModule {
  static forRoot(options: BilrLoggerModulesOptions): DynamicModule {
    return {
      module: BilrLoggerModule,
      providers: [
        {
          provide: BILR_LOGGER_MODULE_OPTIONS,
          useValue: options,
        },
        BilrLogger,
      ],
      exports: [BilrLogger],
    };
  }
}
