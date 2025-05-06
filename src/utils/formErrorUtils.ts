
import { FieldError, FieldErrors, FieldErrorsImpl, Merge } from 'react-hook-form';

/**
 * Safely extracts error message from react-hook-form error objects
 */
export function getErrorMessage(error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | null): string {
  if (!error) return '';
  
  // Handle string error message
  if (typeof error === 'string') return error;
  
  // Access message property if it exists
  if (error && typeof error === 'object' && 'message' in error && error.message) {
    return error.message as string;
  }
  
  // Fallback for other error formats
  return String(error);
}

/**
 * Safely extracts nested error from react-hook-form errors object
 */
export function getNestedError(errors: FieldErrors, path: string): any {
  const keys = path.split('.');
  let currentErrors = errors;
  
  for (const key of keys) {
    if (!currentErrors || typeof currentErrors !== 'object') return null;
    //@ts-ignore - We're checking existence dynamically
    currentErrors = currentErrors[key];
    if (!currentErrors) return null;
  }
  
  return currentErrors;
}
