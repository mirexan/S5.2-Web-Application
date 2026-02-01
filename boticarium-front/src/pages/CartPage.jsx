import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { calculatePriceWithUserDiscount, getUserDiscountLevel } from '../utils/discountUtils';
import { getUserPoints } from '../utils/jwtUtils';
import { checkout } from '../services/orderService';
import { useState } from 'react';

function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    getCartTotal,
    getCartTotalDetails,
    clearCart 
  } = useCart();
  
  const navigate = useNavigate();
  const userPoints = getUserPoints();
  const totalDetails = getCartTotalDetails();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>🛒 Tu Carrito está vacío</h1>
        <p style={{ color: '#666', margin: '20px 0' }}>
          ¡Agrega productos desde el catálogo!
        </p>
        <button 
          onClick={() => navigate('/products')}
          style={{
            padding: '12px 24px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Ver Productos
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🛒 Carrito de Compras</h1>
      
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {cartItems.map((item) => (
          <div 
            key={item.id} 
            style={{
              display: 'flex',
              gap: '20px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              alignItems: 'center',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {/* Imagen del producto */}
            <img 
              src={item.imgUrl || `https://picsum.photos/seed/${item.id}/100/100`}
              alt={item.name}
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            
            {/* Info del producto CON DESCUENTOS */}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
              <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
                {item.description}
              </p>
              
              {/* PRECIOS CON DESCUENTOS APLICADOS */}
              {(() => {
                const priceData = calculatePriceWithUserDiscount(item, userPoints);
                return (
                  <div style={{ margin: '10px 0 0 0' }}>
                    {priceData.discountPercentage > 0 ? (
                      <>
                        <p style={{ 
                          margin: '0', 
                          fontSize: '14px',
                          textDecoration: 'line-through',
                          color: '#999'
                        }}>
                          {priceData.originalPrice} € (precio normal)
                        </p>
                        <p style={{ 
                          fontSize: '18px', 
                          fontWeight: 'bold',
                          color: '#28a745',
                          margin: '5px 0 0 0'
                        }}>
                          {priceData.finalPrice} € 
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#666',
                            marginLeft: '10px',
                            fontWeight: 'normal'
                          }}>
                            ✨ -{ priceData.discountPercentage}% descuento
                          </span>
                        </p>
                      </>
                    ) : (
                      <p style={{ 
                        fontSize: '18px', 
                        fontWeight: 'bold', 
                        color: '#333',
                        margin: '10px 0 0 0'
                      }}>
                        {priceData.originalPrice} € <span style={{ fontSize: '14px', fontWeight: 'normal' }}>/ unidad</span>
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Controles de cantidad */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              minWidth: '150px',
              justifyContent: 'center'
            }}>
              <button 
                onClick={() => decrementQuantity(item.id)}
                style={{
                  width: '35px',
                  height: '35px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              >
                -
              </button>
              
              <span style={{ 
                fontSize: '20px', 
                fontWeight: 'bold',
                minWidth: '30px',
                textAlign: 'center'
              }}>
                {item.quantity}
              </span>
              
              <button 
                onClick={() => incrementQuantity(item.id)}
                style={{
                  width: '35px',
                  height: '35px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              >
                +
              </button>
            </div>

            {/* Subtotal CON DESCUENTOS */}
            {(() => {
              const priceData = calculatePriceWithUserDiscount(item, userPoints);
              const subtotal = parseFloat(priceData.finalPrice) * item.quantity;
              return (
                <div style={{ 
                  textAlign: 'right',
                  minWidth: '120px'
                }}>
                  <p style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    margin: '0',
                    color: '#007bff'
                  }}>
                    {subtotal.toFixed(2)} €
                  </p>
                </div>
              );
            })()}

            {/* Botón eliminar */}
            <button 
              onClick={() => removeFromCart(item.id)}
              style={{
                padding: '10px 15px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              title="Eliminar del carrito"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Resumen del carrito */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <button 
            onClick={clearCart}
            style={{
              padding: '10px 20px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Vaciar Carrito
          </button>
        </div>

        <div style={{ textAlign: 'right' }}>
          {/* Información de usuario y puntos */}
          <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
            👤 Usuario: <strong>{totalDetails.username}</strong>
            <br />
            ⭐ Puntos: <strong>{totalDetails.userPoints || 0}</strong>
          </p>

          {/* Detalle de totales */}
          <div style={{ 
            background: 'white', 
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '15px',
            border: '1px solid #ddd'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
              Subtotal: <strong>{totalDetails.originalTotal} €</strong>
            </p>
            {parseFloat(totalDetails.totalSavings) > 0 && (
              <p style={{ 
                margin: '0 0 8px 0', 
                fontSize: '14px',
                color: '#28a745',
                fontWeight: 'bold'
              }}>
                💰 Ahorros: -{totalDetails.totalSavings} €
              </p>
            )}
            <hr style={{ margin: '10px 0' }} />
            <p style={{ 
              margin: '0', 
              fontSize: '20px', 
              fontWeight: 'bold',
              color: '#28a745'
            }}>
              TOTAL: {totalDetails.discountedTotal} €
            </p>
          </div>

          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#999' }}>
            Total de productos: <strong>{cartItems.length}</strong>
          </p>

          <button 
            onClick={async () => {
              try {
                setIsCheckingOut(true);
                setCheckoutError(null);
                await checkout(cartItems);
                alert('✅ ¡Compra realizada correctamente! Tu pedido está siendo procesado.');
                clearCart();
                navigate('/products');
              } catch (err) {
                setCheckoutError(`❌ Error en la compra: ${err.response?.data?.message || err.message}`);
                console.error(err);
              } finally {
                setIsCheckingOut(false);
              }
            }}
            disabled={isCheckingOut}
            style={{
              marginTop: '15px',
              padding: '12px 30px',
              background: isCheckingOut ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isCheckingOut ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            {isCheckingOut ? '⏳ Procesando...' : 'Finalizar Compra 💳'}
          </button>

          {checkoutError && (
            <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
              {checkoutError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
