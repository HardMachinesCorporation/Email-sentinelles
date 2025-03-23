import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { DatabaseError } from '../errors/database-error';
import { CaptureTypeormError } from '../errors/capture-typeorm-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 🔥 Handle BadRequestException (ValidationPipe Errors)
    if (exception instanceof BadRequestException) {
      return response.status(400).json({
        error: exception.name,
        message: exception.getResponse(), // ✅ Récupère les détails de la validation
      });
    }

    // 🔥 Handle Error specific to db
    if (exception instanceof DatabaseError) {
      return response.status(400).json({
        error: exception.name,
        code: exception.code,
        message: exception.message,
        details: exception.details,
      });
    }

    // 🔥 Handle Error specific Typeorm
    if (exception instanceof CaptureTypeormError) {
      return response.status(500).json({
        error: exception.name,
        code: exception.code,
        message: exception.message,
        details: exception.details,
      });
    }

    // 🔥 Handle Error specific to HTTP classic
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        error: exception.name,
        message: exception.message,
      });
    }

    // 🔥 Handle unknown Error
    return response.status(500).json({
      error: 'InternalServerError',
      message: 'An unknown error occurred.',
    });
  }
}
