import { BilrLogger } from '@bilr/logger';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ReqLoggerMiddleware implements NestMiddleware {
  constructor(private logger: BilrLogger) {}

  use(req: any, res: any, next: () => void) {
    const startAt = process.hrtime();
    const { ip, method, originalUrl } = req;
    // const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const diff = process.hrtime(startAt);
      const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

      this.logger.info(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${ip}`,
        { responseTime },
      );
    });

    next();
  }
}
