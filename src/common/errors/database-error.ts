export const PG_ERROR_MESSAGES: Record<string, string> = {
  '23505': 'This field must be unique. This record already exists.',
  '23503': 'Foreign key violation.',
  '23502': 'A required field is missing.',
  '08001': 'Database connection failed.',
  '40P01': 'A deadlock has been detected.',
};

export class DatabaseError extends Error {
  code: string;
  details?: any;
  constructor(code: string, message: string, details?: any) {
    super(PG_ERROR_MESSAGES[code] || message);
    this.code = code;
    this.details = details;
    this.name = 'DatabaseError';
  }
}
