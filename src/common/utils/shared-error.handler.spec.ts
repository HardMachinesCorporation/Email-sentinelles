import { HttpException, HttpStatus } from '@nestjs/common';
import { sharedErrorHandleErrors } from './shared-error.handler';

describe('sharedErrorHandleErrors', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  // 1️⃣ Cas normal : Erreur classique avec message et stack
  it('should log and throw an HttpException with the given error message', () => {
    const error = new Error('Database connection failed');
    const logMessage = 'Critical database error';
    const errorMessage = 'Failed to connect to database';

    expect(() =>
      sharedErrorHandleErrors(error, logMessage, errorMessage),
    ).toThrowError(
      new HttpException(
        {
          success: false,
          date: expect.any(String),
          message: 'Failed to connect to database',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(logMessage, error.stack);
  });

  // 2️⃣ Cas où errorMessage n'est pas fourni
  it('should throw an HttpException with the default error message if errorMessage is not provided', () => {
    const error = new Error('Validation failed');
    const logMessage = 'Validation error';

    expect(() => sharedErrorHandleErrors(error, logMessage)).toThrowError(
      new HttpException(
        {
          success: false,
          date: expect.any(String),
          message: 'Internal server error while validating password',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(logMessage, error.stack);
  });

  // 3️⃣ Cas où error est un objet sans stack
  it('should handle an object error without a stack property', () => {
    const error = { message: 'An error occurred' };
    const logMessage = 'General error';

    expect(() => sharedErrorHandleErrors(error, logMessage)).toThrowError(
      new HttpException(
        {
          success: false,
          date: expect.any(String),
          message: 'Internal server error while validating password',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      logMessage,
      'No stack trace available',
    );
  });

  // 4️⃣ Cas où error est null
  it('should handle null error gracefully', () => {
    const logMessage = 'Unexpected null error';

    expect(() => sharedErrorHandleErrors(null, logMessage)).toThrowError(
      new HttpException(
        {
          success: false,
          date: expect.any(String),
          message: 'Internal server error while validating password',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      logMessage,
      'No stack trace available',
    );
  });

  // 5️⃣ Cas où error est un string (non recommandé, mais possible)
  it('should handle string errors', () => {
    const error = 'A string error';
    const logMessage = 'String error occurred';

    expect(() =>
      sharedErrorHandleErrors(error as any, logMessage),
    ).toThrowError(
      new HttpException(
        {
          success: false,
          date: expect.any(String),
          message: 'Internal server error while validating password',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      logMessage,
      'No stack trace available',
    );
  });

  // 6️⃣ Cas où error est un nombre (edge case)
  it('should handle numeric errors', () => {
    const error = 404;
    const logMessage = 'Unexpected number error';

    expect(() =>
      sharedErrorHandleErrors(error as any, logMessage),
    ).toThrowError(
      new HttpException(
        {
          success: false,
          date: expect.any(String),
          message: 'Internal server error while validating password',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      logMessage,
      'No stack trace available',
    );
  });

  // 7️⃣ Cas où error est un objet totalement vide (edge case)
  it('should handle empty object errors', () => {
    const error = {};
    const logMessage = 'Empty object error';

    expect(() => sharedErrorHandleErrors(error, logMessage)).toThrowError(
      new HttpException(
        {
          success: false,
          date: expect.any(String),
          message: 'Internal server error while validating password',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      logMessage,
      'No stack trace available',
    );
  });

  // 8️⃣ Cas où error est une erreur personnalisée avec code et metadata
  it('should handle custom error objects with additional metadata', () => {
    const error = {
      message: 'Custom error occurred',
      stack: 'Custom stack trace',
      code: 'CUSTOM_ERROR',
    };
    const logMessage = 'Custom error handling';

    expect(() => sharedErrorHandleErrors(error, logMessage)).toThrowError(
      new HttpException(
        {
          success: false,
          date: expect.any(String),
          message: 'Internal server error while validating password',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(logMessage, error.stack);
  });

  // 9️⃣ Cas où error est complètement incohérent (ex : array, function)
  it('should handle unexpected error types like arrays or functions', () => {
    const logMessage = 'Unexpected error type';

    expect(() => sharedErrorHandleErrors([] as any, logMessage)).toThrowError(
      new HttpException(
        {
          success: false,
          date: expect.any(String),
          message: 'Internal server error while validating password',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    expect(() =>
      sharedErrorHandleErrors((() => {}) as any, logMessage),
    ).toThrowError(
      new HttpException(
        {
          success: false,
          date: expect.any(String),
          message: 'Internal server error while validating password',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      logMessage,
      'No stack trace available',
    );
  });
});
