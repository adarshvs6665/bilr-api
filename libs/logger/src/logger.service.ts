import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { BilrLoggerModulesOptions, BILR_LOGGER_MODULE_OPTIONS } from './lib';
import { ILogger, Logger, LoggerOptions } from './lib';
import { randomUUID } from 'node:crypto';

@Injectable()
export class BilrLogger implements LoggerService, ILogger {
  private logger: Logger;
  private loggerOptions: LoggerOptions;

  constructor(
    @Inject(BILR_LOGGER_MODULE_OPTIONS)
    options: BilrLoggerModulesOptions,
  ) {
    this.loggerOptions = {
      component: options.component,
      logLevel: options.logLevel,
      isProduction:
        options.isProduction ?? process.env['NODE_ENV'] === 'production',
      metadata: options.metadata,
    };

    this.logger = new Logger(this.loggerOptions);
  }

  private getCorrelationId(): string | undefined {
    return randomUUID();
  }

  public attachCorrelationId(id = this.getCorrelationId()): string | undefined {
    this.logger.setRequestId(id);
    return id;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debug(message: string, ...args: any[]): void {
    args = args.filter((arg) => typeof arg === 'object');
    this.logger.debug(message, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public info(message: string, ...args: any[]): void {
    args = args.filter((arg) => typeof arg === 'object');
    this.logger.info(message, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public warn(message: string, ...args: any[]): void {
    args = args.filter((arg) => typeof arg === 'object');
    this.logger.warn(message, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(message: string, error?: Error, ...args: any[]): void {
    args = args.filter((arg) => typeof arg === 'object');
    this.logger.error(message, error, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public log(message: string, ...args: any[]): void {
    args = args.filter((arg) => typeof arg === 'object');
    this.logger.info(message, ...args);
  }

  /**
   * Generated a new logger instance with the same configuration of the parent with additional metadata.
   * @param  {Record<string, unknown} metadata?
   * @returns Logger
   */
  public child(metadata?: Record<string, unknown>): Logger {
    const childOptions = {
      ...this.loggerOptions,
      metadata: {
        ...this.loggerOptions.metadata,
        ...metadata,
      },
    };

    return new Logger(childOptions);
  }
}
