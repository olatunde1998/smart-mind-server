import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: any) => this.responseHandler(res, context)),
      catchError((err: any) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const status_code = response.statusCode;

    response.setHeader('Content-Type', 'application/json');

    // If already shaped as { message, data }
    if (
      typeof res === 'object' &&
      res !== null &&
      'message' in res &&
      'data' in res
    ) {
      return {
        status_code,
        message: res.message,
        data: res.data,
      };
    }

    // Wrap raw response (array/object/string/etc)
    return {
      status_code,
      message: 'Request successful',
      data: res,
    };
  }

  errorHandler(error: any, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (error instanceof HttpException) {
      const status = error.getStatus();
      const response = error.getResponse();

      // class-validator errors
      if (
        typeof response === 'object' &&
        response !== null &&
        Array.isArray((response as any).message)
      ) {
        return new HttpException(
          {
            status_code: status,
            message: 'Validation failed',
            errors: (response as any).message,
          },
          status,
        );
      }

      // Generic HttpException with string message
      return new HttpException(
        {
          status_code: status,
          message:
            typeof response === 'string'
              ? response
              : (response as any).message || 'An error occurred',
        },
        status,
      );
    }

    // Unexpected internal errors
    this.logger.error(
      `Unhandled error in ${req.method} ${req.url}: ${error?.message}\n${error?.stack}`,
    );

    return new InternalServerErrorException({
      status_code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
