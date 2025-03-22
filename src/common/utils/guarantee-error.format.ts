// Type Guard pour vérifier si error a les propriétés code, message et stack
export function guaranteeErrorFormat(
  error: unknown,
): error is { code: string; message?: string; stack?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as any).code === 'string' &&
    ('message' in error ? typeof (error as any).message === 'string' : true) &&
    ('stack' in error ? typeof (error as any).stack === 'string' : true)
  );
} //
