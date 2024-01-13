import { BilrLogger } from '@bilr/logger';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ReqCorrelationIdMiddleware implements NestMiddleware {
  constructor(private logger: BilrLogger) {}

  use(req: any, res: any, next: () => void) {
    const existingCorrelationId = req.headers['x-correlation-id'];

    // Call the logger function with or without an argument
    const correlationId = existingCorrelationId
      ? this.logger.attachCorrelationId(existingCorrelationId)
      : this.logger.attachCorrelationId();

    // Attach correlation ID to the request object for later use
    req['x-correlation-id'] = correlationId;

    // Set the correlation ID in the response headers for downstream services
    res.setHeader('x-correlation-id', correlationId);

    // Log the correlation ID
    console.log(`Correlation ID: ${correlationId}`);

    // Call the next middleware or route handler
    next();
  }
}
