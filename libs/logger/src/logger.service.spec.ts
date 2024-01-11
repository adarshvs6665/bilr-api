import { Test, TestingModule } from '@nestjs/testing';
import { BilrLogger } from './index';
import { BILR_LOGGER_MODULE_OPTIONS, BilrLoggerModulesOptions } from './lib';

describe('BilrLogger', () => {
  let service: BilrLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BilrLogger,
        {
          provide: BILR_LOGGER_MODULE_OPTIONS,
          useValue: {
            component: 'test-component',
            logLevel: 'debug',
            isProduction: false,
            metadata: {},
          } as BilrLoggerModulesOptions,
        },
      ],
    }).compile();

    service = module.get<BilrLogger>(BilrLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log a message at debug level', () => {
    const debugSpy = jest.spyOn(service, 'debug');
    service.debug('Test Debug Message');
    expect(debugSpy).toHaveBeenCalledWith('Test Debug Message');
  });

  it('should log a message at info level', () => {
    const infoSpy = jest.spyOn(service, 'info');
    service.info('Test Info Message');
    expect(infoSpy).toHaveBeenCalledWith('Test Info Message');
  });

  it('should log a message at warn level', () => {
    const warnSpy = jest.spyOn(service, 'warn');
    service.warn('Test Warn Message');
    expect(warnSpy).toHaveBeenCalledWith('Test Warn Message');
  });

  it('should log a message at error level', () => {
    const errorSpy = jest.spyOn(service, 'error');
    const mockError = new Error('Test Error');
    service.error('Test Error Message', mockError);
    expect(errorSpy).toHaveBeenCalledWith('Test Error Message', mockError);
  });

  it('should log a message at log level', () => {
    const logSpy = jest.spyOn(service, 'log');
    service.log('Test Log Message');
    expect(logSpy).toHaveBeenCalledWith('Test Log Message');
  });

  it('should create a child logger with additional metadata', () => {
    const childLogger = service.child({ additionalData: 'test' });
    expect(childLogger).toBeDefined();
    // Add assertions for the child logger, if needed
  });
});
