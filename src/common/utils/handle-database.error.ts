import { DatabaseError, PG_ERROR_MESSAGES } from '../errors/database-error';
import {
  CaptureTypeormError,
  TYPEORM_ERROR_MESSAGES,
} from '../errors/capture-typeorm-error';

export function handleDatabaseError(error: unknown): never {
  if (error instanceof Error && 'code' in error) {
    const code = String((error as any).code);
    const message = error.message;
    const details = JSON.stringify(error); // 🔥 Transformer en string proprement

    if (PG_ERROR_MESSAGES[code]) {
      throw new DatabaseError(code, message, details);
    } else if (TYPEORM_ERROR_MESSAGES[code]) {
      throw new CaptureTypeormError(code, message, details);
    }
  }
  throw error; // 🔥 Relance si ce n'est pas une erreur DB
}
