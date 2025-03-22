import { BadRequestException } from '@nestjs/common';
import { z, ZodError } from 'zod';

/**
 * Fonction de validation centralisée des variables d'environnement avec Zod
 */
export function validateConfig<T extends z.ZodTypeAny>(
  config: Record<string, unknown>,
  schema: T,
) {
  try {
    return schema.parse(config); // Valide et retourne les données
  } catch (error) {
    if (error instanceof ZodError) {
      const missingFields: string[] = [];
      const forbiddenFields: string[] = [];

      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const key = err.path.join('.'); // Nom de la clé

          if (err.message.includes('Required')) {
            missingFields.push(key);
          } else {
            forbiddenFields.push(key);
          }
        }
      });

      // Gestion des erreurs 400 - Bad Request
      if (missingFields.length > 0) {
        throw new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Configuration validation failed',
          missingFields, // Liste des champs manquants
        });
      }

      // Avertissement pour les champs inconnus
      if (forbiddenFields.length > 0) {
        console.warn('⚠️ Forbidden fields detected in .env:', forbiddenFields);
      }
    }

    throw error; // Autres erreurs non gérées
  }
}
