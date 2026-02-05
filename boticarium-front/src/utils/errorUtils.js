/**
 * Limpia mensajes de error eliminando referencias a localhost y URLs
 * @param {string} errorMessage - Mensaje de error original
 * @returns {string} - Mensaje limpio
 */
export function cleanErrorMessage(errorMessage) {
  if (!errorMessage) return 'Error desconocido';

  // Convertir a string si no lo es
  let message = String(errorMessage);

  // Eliminar referencias a localhost:port
  message = message.replace(/http:\/\/localhost:\d+/g, '');
  message = message.replace(/https:\/\/localhost:\d+/g, '');

  // Eliminar URLs en general
  message = message.replace(/https?:\/\/[^\s]+/g, '');

  // Eliminar múltiples espacios
  message = message.replace(/\s+/g, ' ').trim();

  // Eliminar "at http://" o "at https://"
  message = message.replace(/\s*at\s+(https?:\/\/)?.*$/i, '');

  // Limpiar espacios extras nuevamente
  message = message.trim();

  return message || 'Error desconocido';
}
