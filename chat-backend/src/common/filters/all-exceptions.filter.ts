import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // HTTP context (GraphQL errors are handled by Apollo; we still log here)
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse?.();
    const request: any = ctx.getRequest?.();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : ((res as any)?.message ?? exception.message);
    } else if (exception && (exception as any).message) {
      message = (exception as any).message;
    }

    const payload = {
      statusCode: status,
      error: message,
      path: request?.url,
      timestamp: new Date().toISOString(),
    };

    // If we have an HTTP response, return JSON; otherwise just log (e.g., GraphQL)
    if (response?.status) {
      response.status(status).json(payload);
    } else {
      // eslint-disable-next-line no-console
      console.error('Non-HTTP exception', payload, exception);
    }
  }
}
