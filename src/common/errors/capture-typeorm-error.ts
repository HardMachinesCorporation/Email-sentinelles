export const TYPEORM_ERROR_MESSAGES: Record<string, string> = {
  ER_DUP_ENTRY: 'Duplication de clé unique détectée.',
  ER_NO_REFERENCED_ROW: 'Violation de clé étrangère.',
  ER_NO_DEFAULT_FOR_FIELD: 'Un champ obligatoire est manquant.',
  ER_LOCK_DEADLOCK: 'Un deadlock a été détecté.',
  ER_QUERY_INTERRUPTED: 'La requête a été interrompue.',
  ER_SYNTAX_ERROR: 'Erreur de syntaxe SQL.',
  ER_ACCESS_DENIED_ERROR: 'Accès refusé à la base de données.',
  ER_UNKNOWN_ERROR: "Une erreur inconnue de TypeORM s'est produite.",
};

export class CaptureTypeormError extends Error {
  code: string;
  details?: string;
  constructor(code: string, message: string, details?: string) {
    super(
      TYPEORM_ERROR_MESSAGES[code] ||
        message ||
        'An unexpected and unknown error occurred.',
    );
    this.code = code;
    this.details = details;
    this.name = 'TypeormError';
  }
}
