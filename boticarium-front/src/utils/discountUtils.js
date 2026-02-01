/**
 * Servicio de cálculo de descuentos
 * 
 * CONCEPTOS EDUCATIVOS:
 * 
 * En el BACKEND (Java):
 * - La BD tiene todos los datos del usuario (puntos, rol, etc)
 * - El servicio calcula dinámicamente basado en la BD
 * - Es más seguro (el cliente no puede mentir sobre sus puntos)
 * 
 * En el FRONTEND (React):
 * - Solo tenemos el JWT (datos limitados)
 * - Usamos estos datos para UX temprana (mostrar precios antes de enviar)
 * - El backend siempre revalida cuando se crea una orden
 * 
 * Sistema de puntos:
 * - Level 0 (0-99 puntos): Sin descuento
 * - Level 1 (100-299 puntos): discountLevel1%
 * - Level 2 (300-499 puntos): discountLevel2%
 * - Level 3 (500+ puntos): discountLevel3%
 */

/**
 * Determina el nivel de descuento según los puntos del usuario
 * @param {number} points - Puntos del usuario
 * @returns {number} - Nivel 0, 1, 2 o 3
 */
export const getUserDiscountLevel = (points) => {
  if (!points || points < 0) return 0;
  
  if (points >= 500) return 3;
  if (points >= 300) return 2;
  if (points >= 100) return 1;
  return 0;
};

/**
 * Calcula el precio con descuento aplicado
 * 
 * EJEMPLO (como en tu backend):
 * basePrice: 100€
 * discountLevel2: 10%
 * Resultado: 100 - (100 * 10%) = 90€
 * 
 * @param {number} basePrice - Precio base del producto
 * @param {number} discountPercentage - % de descuento (ej: 10)
 * @returns {number} - Precio final con 2 decimales
 */
export const calculateDiscountedPrice = (basePrice, discountPercentage) => {
  if (!basePrice || !discountPercentage || discountPercentage === 0) {
    return parseFloat(basePrice).toFixed(2);
  }

  // basePrice * (1 - discountPercentage/100)
  // Ejemplo: 100 * (1 - 10/100) = 100 * 0.9 = 90
  const factor = 1 - discountPercentage / 100;
  const discountedPrice = basePrice * factor;
  
  return parseFloat(discountedPrice).toFixed(2);
};

/**
 * Obtiene el porcentaje de descuento para un producto según nivel del usuario
 * 
 * ESTO ES IMPORTANTE:
 * El producto puede tener diferentes descuentos según el nivel
 * Ejemplo:
 * - Nuevo usuario → 0% descuento
 * - Usuario con 150 puntos → 5% (discountLevel1)
 * - Usuario con 400 puntos → 10% (discountLevel2)
 * - Usuario VIP con 600 puntos → 15% (discountLevel3)
 * 
 * @param {object} product - Objeto producto con discountLevel1, 2, 3
 * @param {number} userLevel - Nivel del usuario (0, 1, 2, 3)
 * @returns {number} - Porcentaje de descuento (0-100)
 */
export const getDiscountPercentageForProduct = (product, userLevel) => {
  if (!product || !userLevel || userLevel < 0) return 0;

  switch (userLevel) {
    case 3:
      return product.discountLevel3 || 0;
    case 2:
      return product.discountLevel2 || 0;
    case 1:
      return product.discountLevel1 || 0;
    default:
      return 0;
  }
};

/**
 * Función integrada: calcula el precio final de un producto para un usuario
 * 
 * FLUJO:
 * 1. Obtener puntos del usuario → calcular nivel
 * 2. Obtener descuento del producto para ese nivel
 * 3. Aplicar descuento al precio base
 * 
 * @param {object} product - El producto completo
 * @param {number} userPoints - Puntos del usuario
 * @returns {object} - { originalPrice, discount%, finalPrice }
 */
export const calculatePriceWithUserDiscount = (product, userPoints) => {
  const userLevel = getUserDiscountLevel(userPoints);
  const discountPercentage = getDiscountPercentageForProduct(product, userLevel);
  const finalPrice = calculateDiscountedPrice(
    product.basePrice,
    discountPercentage
  );

  // DEBUG: Log para verificar qué se recibe del backend
  if (process.env.NODE_ENV === 'development' && false) { // Disabled by default
    console.log('[DISCOUNT DEBUG]', {
      productId: product.id,
      productName: product.name,
      userPoints,
      userLevel,
      discountLevel1: product.discountLevel1,
      discountLevel2: product.discountLevel2,
      discountLevel3: product.discountLevel3,
      basePrice: product.basePrice,
      discountPercentage,
      finalPrice
    });
  }

  return {
    originalPrice: parseFloat(product.basePrice).toFixed(2),
    discountPercentage,
    userLevel,
    finalPrice,
    savings: (parseFloat(product.basePrice) - parseFloat(finalPrice)).toFixed(2)
  };
};
