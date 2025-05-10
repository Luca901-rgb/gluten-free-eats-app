
import { FieldError } from 'react-hook-form';

/**
 * Ottiene il messaggio di errore da un oggetto FieldError
 */
export const getErrorMessage = (error: FieldError | undefined): string => {
  if (!error) return '';
  return error.message || 'Campo non valido';
};

/**
 * Ottiene l'errore da un path nidificato in un oggetto errors
 */
export const getNestedError = (errors: Record<string, any>, path: string): FieldError | undefined => {
  const parts = path.split('.');
  let current = errors;
  
  for (const part of parts) {
    if (!current[part]) return undefined;
    current = current[part];
  }
  
  return current as FieldError;
};

/**
 * Verifica se un'intera sezione del form contiene errori
 */
export const hasStepErrors = (errors: Record<string, any>, stepName: string): boolean => {
  return !!errors[stepName] && Object.keys(errors[stepName]).length > 0;
};
