import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known errors by code
      switch (exception.code) {
        case 'P2002': // Unique constraint violation
          status = HttpStatus.CONFLICT;
          message = `Unique constraint failed on: ${exception.meta?.target}`;
          break;
        case 'P2025': // Record not found
          status = HttpStatus.NOT_FOUND;
          message = `Record not found`;
          break;
        default:
          message = exception.message;
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception && (exception as any).message) {
      message = (exception as any).message;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const payload = {
      statusCode: status,
      error: message,
      path: request?.url,
      timestamp: new Date().toISOString(),
    };

    if (response?.status) {
      response.status(status).json(payload);
    } else {
      // For GraphQL / WS, just log (Apollo has its own error pipeline)
      // eslint-disable-next-line no-console
      console.error('Prisma error caught:', payload, exception);
    }
  }
}
