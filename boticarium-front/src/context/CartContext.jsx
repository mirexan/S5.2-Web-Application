import { createContext, useContext, useState, useEffect } from 'react';
import { getUserPoints, getUsername } from '../utils/jwtUtils';
import { calculatePriceWithUserDiscount } from '../utils/discountUtils';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Cargar el carrito desde localStorage al inicializar
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Añadir producto al carrito
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Si el producto ya existe, incrementar la cantidad
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si es nuevo, añadirlo al carrito
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Quitar producto del carrito
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Incrementar cantidad en 1
  const incrementQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrementar cantidad en 1
  const decrementQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter((item) => item.quantity > 0)
    );
  };

  // Vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular el total del carrito CON DESCUENTOS APLICADOS
  const getCartTotal = () => {
    const userPoints = getUserPoints();
    
    return cartItems.reduce((total, item) => {
      // Calcular el precio con descuento según los puntos del usuario
      const priceData = calculatePriceWithUserDiscount(item, userPoints);
      const finalPrice = parseFloat(priceData.finalPrice);
      
      return total + (finalPrice * item.quantity);
    }, 0);
  };

  // Obtener detalle del total (precio original + ahorros)
  const getCartTotalDetails = () => {
    const userPoints = getUserPoints();
    let originalTotal = 0;
    let discountedTotal = 0;
    let totalSavings = 0;

    cartItems.forEach((item) => {
      const priceData = calculatePriceWithUserDiscount(item, userPoints);
      const original = parseFloat(priceData.originalPrice) * item.quantity;
      const discounted = parseFloat(priceData.finalPrice) * item.quantity;
      
      originalTotal += original;
      discountedTotal += discounted;
      totalSavings += parseFloat(priceData.savings) * item.quantity;
    });

    return {
      originalTotal: originalTotal.toFixed(2),
      discountedTotal: discountedTotal.toFixed(2),
      totalSavings: totalSavings.toFixed(2),
      userPoints,
      username: getUsername()
    };
  };

  // Obtener cantidad total de items
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  // Obtener cantidad de un producto específico
  const getItemQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getCartTotal,
    getCartTotalDetails,
    getCartItemsCount,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
