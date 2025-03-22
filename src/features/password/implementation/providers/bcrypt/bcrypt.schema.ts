import { z } from 'zod';

export const bcryptSchema = z.object({
  SALT_ROUNDS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((num) => !isNaN(num), {
      message: 'SALT_ROUNDS must be a valid number',
    })
    .refine((num) => num > 10 && num <= 20, {
      message: 'SALT_ROUNDS must be between 11 and 20',
    }),
});
