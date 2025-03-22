import { z } from 'zod';

export const neonSchema = z.object({
  DATABASE_URL: z
    .string()
    .url({ message: 'DATABASE_URL must be a valid URL' }) // Vérifie si c'est une URL valide
    .regex(/^postgres(ql)?:\/\//, {
      message: 'DATABASE_URL must be a PostgreSQL URL',
    }) // Vérifie si c'est bien une URL PostgreSQL
    .nonempty({ message: 'DATABASE_URL is required' }), // Vérifie que ce n'est pas vide
});
