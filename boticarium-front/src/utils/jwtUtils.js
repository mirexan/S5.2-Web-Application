/**
 * Utilidades para trabajar con JWT en React
 * 
 * Un JWT tiene 3 partes: header.payload.signature
 * Solo nos interesa el payload (parte 2) que contiene los datos del usuario
 */

/**
 * Decodifica un JWT y extrae el payload
 * @param {string} token - El JWT token del localStorage
 * @returns {object} - Objeto con los datos: { sub, iat, exp, role, points, etc }
 * 
 * Ejemplo:
 * const userData = decodeJWT(localStorage.getItem('token'));
 * console.log(userData.sub);  // "Mirexan"
 * console.log(userData.role); // "USER"
 */
export const decodeJWT = (token) => {
  if (!token) return null;

  try {
    // Dividir el token en sus 3 partes
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    // El payload es la segunda parte
    const payload = parts[1];

    // Decodificar de base64 (con padding correcto)
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};

/**
 * Obtiene el username del token
 * @returns {string|null} - Username o null si no hay token
 */
export const getUsername = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const payload = decodeJWT(token);
  return payload?.sub || null; // 'sub' es el estándar JWT para subject (usuario)
};

/**
 * Obtiene el rol del usuario del token
 * @returns {string|null} - 'ADMIN', 'USER' o null
 */
export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const payload = decodeJWT(token);
  return payload?.role || null;
};

/**
 * Obtiene los puntos del usuario del token
 * @returns {number|null} - Puntos o null
 */
export const getUserPoints = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const payload = decodeJWT(token);
  return payload?.points || null;
};

/**
 * Comprueba si el usuario es admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  return getUserRole() === 'ADMIN';
};

/**
 * Obtiene el nivel del usuario del token
 * @returns {number|null} - Nivel (0, 1, 2, 3) o null
 */
export const getLevel = () => {
  const token = localStorage.getItem('token');
  if (!token) return 0;

  const payload = decodeJWT(token);
  return payload?.level || 0;
};

/**
 * Verifica si el token ha expirado
 * @returns {boolean} - true si ha expirado, false si aún es válido
 */
export const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true;

  const payload = decodeJWT(token);
  if (!payload?.exp) return false;

  // exp está en segundos, Date.now() en milisegundos
  return payload.exp * 1000 < Date.now();
};
