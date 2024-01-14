import { Base as Exception } from './Base';
import {
  // 4XX
  BadRequestException,
  ConflictException,
  ForbiddenException,
  MethodNotAllowedException,
  NotFoundException,
  TooManyRequestsException,
  UnauthorizedException,
  // 5XX
  InternalErrorException,
  ServerNotFoundException,
  TimeOutException,
} from './Exceptions';

export {
  // Typed Exceptions
  Exception,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  MethodNotAllowedException,
  NotFoundException,
  TooManyRequestsException,
  UnauthorizedException,
  InternalErrorException,
  ServerNotFoundException,
  TimeOutException,
};
