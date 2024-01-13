import { BilrLogger } from '@bilr/logger';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private logger: BilrLogger) {}

  getHello(): string {
    return 'Hello World!';
  }
}
