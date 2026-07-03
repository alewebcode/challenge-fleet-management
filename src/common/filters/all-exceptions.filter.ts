import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  DomainConflictException,
  DomainNotFoundException,
  DomainUnauthorizedException,
} from '../exceptions/domain.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message } = this.resolveException(exception);

    response.status(statusCode).json({
      statusCode,
      error: HttpStatus[statusCode] ?? 'Error',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private resolveException(exception: unknown): {
    statusCode: number;
    message: string;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === 'string'
          ? body
          : ((body as Record<string, unknown>).message?.toString() ??
            exception.message);
      return { statusCode: status, message };
    }

    if (exception instanceof DomainNotFoundException) {
      return { statusCode: HttpStatus.NOT_FOUND, message: exception.message };
    }

    if (exception instanceof DomainConflictException) {
      return { statusCode: HttpStatus.CONFLICT, message: exception.message };
    }

    if (exception instanceof DomainUnauthorizedException) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: exception.message,
      };
    }

    const err = exception as Error;
    this.logger.error(
      `Unhandled exception: ${err?.message ?? String(exception)}`,
      err?.stack,
    );

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
    };
  }
}
