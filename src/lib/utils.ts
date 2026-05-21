import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Escapa caracteres HTML especiales para prevenir inyecciones de script (XSS).
 */
export function sanitizeInput(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Limpia y valida estrictamente un identificador según su tipo de búsqueda
 * para evitar inyecciones de código y datos corruptos.
 */
export function cleanIdentifier(val: string, type: string): string {
  if (typeof val !== 'string') return '';
  
  const trimmed = val.trim();
  
  switch (type) {
    case 'dni':
    case 'ruc10-by-dni':
    case 'dni-verification-digit':
      // DNI: Solo dígitos
      return trimmed.replace(/\D/g, '').slice(0, 8);
      
    case 'ruc':
    case 'ruc-debt':
    case 'ruc10-names':
      // RUC: Solo dígitos
      return trimmed.replace(/\D/g, '').slice(0, 11);
      
    case 'plate':
    case 'soat':
      // Placa: Solo alfanuméricos y guiones
      return trimmed.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase().slice(0, 10);
      
    case 'how-many-same-name':
      // Nombres: Letras, espacios y caracteres acentuados comunes en español
      return trimmed.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '').slice(0, 100);
      
    default:
      return sanitizeInput(trimmed);
  }
}
