import { BilrLogger } from '@bilr/logger';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Base } from 'src/errors/Base';
import errorToJSON from 'error-to-json';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: BilrLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const err: any = errorToJSON(exception);
    err.stack = undefined;

    this.logger.error(exception.message, exception);

    if ('statusCode' in err) {
      status = err.statusCode as number;
      response.status(status).json({
        status: status,
        message: err.message,
        path: request.url,
        data: Base.fromHttpCode(
          +err.statusCode,
          err.message,
          undefined,
          { err },
          false,
        ),
      });
    } else {
      response.status(status).json({
        status: status,
        message: err.message,
        path: request.url,
        data: err,
      });
    }
  }
}
