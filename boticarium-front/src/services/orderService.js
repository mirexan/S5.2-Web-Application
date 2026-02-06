import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Realiza el checkout: convierte el carrito en una orden
 * @param {array} items - Array de { productId, quantity }
 * @returns {Promise} Respuesta del servidor con orden creada
 */
export const checkout = async (items) => {
  try {
    const token = localStorage.getItem('token');
    
    // Preparar datos en el formato que espera el backend (OrderRequest)
    const orderData = {
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error en checkout:', error);
    throw error;
  }
};
