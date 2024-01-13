import {
  createLogger,
  format,
  Logger as WindstonLogger,
  transports,
} from 'winston';
import { ILogger, LoggerOptions, LogLevel } from './types';
import { Format } from 'logform';
import { customFormat } from './cli-format';
import { randomUUID } from 'crypto';

const logTransports = [new transports.Console()];

export class Logger implements ILogger {
  private logger: WindstonLogger;
  public level: LogLevel;
  private requestId: string = randomUUID();

  constructor(private readonly options: LoggerOptions) {
    this.level = options.logLevel ?? LogLevel.Debug;
    const format = this.getLoggerFormat();
    this.logger = createLogger({
      defaultMeta: {
        component: options.component,
        ...options.metadata,
      },
      level: this.level,
      format,
      transports: logTransports,
      handleExceptions: true,
      exitOnError: true,
      exceptionHandlers: logTransports,
      rejectionHandlers: logTransports,
    });
  }

  public setRequestId(id: string) {
    this.requestId = id;
  }

  public getLoggerFormat(): Format {
    const developmentFormats: Format[] = [
      format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss:SSS' }),
      format.errors({ stack: true, cause: true }),
      customFormat(),
    ];
    if (this.options.additionalDevelopmentFormats) {
      developmentFormats.push(...this.options.additionalDevelopmentFormats);
    }
    if (this.options.additionalFormats) {
      developmentFormats.push(...this.options.additionalFormats);
    }

    const productionFormats: Format[] = [
      format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss:SSS' }),
      format.errors({ stack: true, cause: true }),
      format.json(),
    ];
    if (this.options.additionalFormats) {
      productionFormats.push(...this.options.additionalFormats);
    }

    return this.options.isProduction
      ? format.combine(
          format((info) => {
            info.requestId = this.requestId;
            return info;
          })(),
          ...productionFormats,
        )
      : format.combine(
          format((info) => {
            info.requestId = this.requestId;
            return info;
          })(),
          ...developmentFormats,
        );
  }

  debug(message: string, params?: Record<string, unknown>): void {
    this.logger.debug(message, params);
  }

  info(message: string, params?: Record<string, unknown>): void {
    this.logger.info(message, params);
  }

  warn(message: string, params?: unknown): void {
    this.logger.warn(message, params);
  }

  error(
    message: string,
    error?: Error,
    params?: Record<string, unknown>,
  ): void {
    if (error) {
      Object.assign(error, {
        message,
        ...(error.message !== message ? { errorMessage: error.message } : {}),
        ...params,
      });
      this.logger.error(error);
    }
    this.logger.error(message, params);
  }

  child(metadata?: Pick<LoggerOptions, 'metadata'>): Logger {
    return new Logger({
      ...this.options,
      metadata: { ...this.options.metadata, ...metadata },
    });
  }
}
