import { Base } from './Base';

export interface IException {
  statusCode: number;
}

////////////////////////////////////////////////////////////////////////////////////////////////
// WARNING: All classes in this file MUST extend "Base" and have their own statusCode() getter//
////////////////////////////////////////////////////////////////////////////////////////////////

// 4XX errors
export class BadRequestException extends Base implements IException {
  public get statusCode(): number {
    return 400;
  }
}

export class UnauthorizedException extends Base implements IException {
  public get statusCode(): number {
    return 401;
  }
}

export class ForbiddenException extends Base implements IException {
  public get statusCode(): number {
    return 403;
  }
}

export class NotFoundException extends Base implements IException {
  public get statusCode(): number {
    return 404;
  }
}

export class MethodNotAllowedException extends Base implements IException {
  public get statusCode(): number {
    return 405;
  }
}

export class ConflictException extends Base implements IException {
  public get statusCode(): number {
    return 409;
  }
}

export class TooManyRequestsException extends Base implements IException {
  public get statusCode(): number {
    return 429;
  }
}

// 5XX errors
export class InternalErrorException extends Base {
  public get statusCode(): number {
    return 500;
  }
}

export class ServerNotFoundException extends Base implements IException {
  public get statusCode(): number {
    return 503;
  }
}

export class TimeOutException extends Base implements IException {
  public get statusCode(): number {
    return 504;
  }
}
