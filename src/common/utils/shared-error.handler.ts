import { HttpException, HttpStatus } from '@nestjs/common';

export function sharedErrorHandleErrors(
  error: Error | any,
  logMessage: string,
  errorMessage?: string,
): never {
  const stackTrace =
    error && typeof error === 'object' && 'stack' in error
      ? error.stack
      : 'No stack trace available';

  console.log(logMessage, stackTrace);

  throw new HttpException(
    {
      success: false,
      date: new Date().toISOString(),
      message:
        errorMessage ?? 'Internal server error while validating password',
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
