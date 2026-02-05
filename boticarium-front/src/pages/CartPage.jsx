import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { calculatePriceWithUserDiscount, getUserDiscountLevel } from '../utils/discountUtils';
import { getUserPoints } from '../utils/jwtUtils';
import { checkout } from '../services/orderService';
import { useState, useEffect } from 'react';
import { showToast } from '../components/Toast';
import { cleanErrorMessage } from '../utils/errorUtils';

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

  // Verificar si hay una factura pendiente en localStorage al cargar
  useEffect(() => {
    console.log('🔍 CartPage.useEffect: Verificando localStorage...');
    const pendingInvoice = localStorage.getItem('lastInvoice');
    if (pendingInvoice) {
      console.log('✅ Factura pendiente encontrada - navegando a /invoice');
      window.location.href = '/invoice';
    }
  }, []);

  // No mostrar "carrito vacío" si está en proceso de checkout
  if (cartItems.length === 0 && !isCheckingOut) {
    return (
      <div style={{ background: 'linear-gradient(180deg, #f7f3eb 0%, #efe7d8 100%)', minHeight: '100vh', padding: '40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
          <h1 style={{ color: '#3f4f36', marginTop: 0 }}>🛒 Tu Carrito está vacío</h1>
          <p style={{ color: '#5a4a3c', margin: '20px 0' }}>
            ¡Agrega productos desde el catálogo!
          </p>
          <button 
            onClick={() => navigate('/products')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '700'
            }}
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  // Mostrar loading si está procesando un checkout
  if (isCheckingOut) {
    return (
      <div style={{ background: 'linear-gradient(180deg, #f7f3eb 0%, #efe7d8 100%)', minHeight: '100vh', padding: '40px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
          <p style={{ color: '#3f4f36', fontSize: '1.5em', marginTop: 0 }}>⏳</p>
          <h1 style={{ color: '#3f4f36', marginTop: '10px' }}>Procesando tu pedido...</h1>
          <p style={{ color: '#5a4a3c', margin: '15px 0' }}>
            Por favor, espera mientras completamos tu compra
          </p>
          <div style={{ marginTop: '20px', fontWeight: 'bold', color: '#6b8f71' }}>
            ⏳ Un momento...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #f7f3eb 0%, #efe7d8 100%)', 
      minHeight: '100vh', 
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#3f4f36', marginTop: 0, marginBottom: 0 }}>🛒 Carrito de Compras</h1>
          <button 
            onClick={() => {
              clearCart();
              showToast('🛒 Carrito vaciado correctamente', 'clear');
            }}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #8B6F47 0%, #CD7F32 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(139, 111, 71, 0.3)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            🗑️ Vaciar Carrito
          </button>
        </div>
      
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {cartItems.map((item) => (
          <div 
            key={item.id} 
            style={{
              display: 'flex',
              gap: '20px',
              padding: '15px',
              border: '1px solid #e1d3bf',
              borderRadius: '12px',
              alignItems: 'center',
              backgroundColor: 'white',
              boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
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
                            color: '#6b8f71',
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
                        color: '#5a4a3c',
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
                  background: '#b07a64',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
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
                  background: '#6b8f71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
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
                    color: '#6b8f71'
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
                background: '#b07a64',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
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
        background: '#f5f2ea',
        borderRadius: '12px',
        border: '1px solid #e1d3bf'
      }}>
        <div style={{ textAlign: 'center' }}>
          {/* Información de usuario y puntos */}
          <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#5a4a3c' }}>
            👤 Usuario: <strong>{totalDetails.username}</strong>
            <br />
            ⭐ Puntos: <strong>{totalDetails.userPoints || 0}</strong>
          </p>

          {/* Detalle de totales */}
          <div style={{ 
            background: 'white', 
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '15px',
            border: '1px solid #e1d3bf',
            maxWidth: '400px',
            margin: '0 auto 15px auto'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
              Subtotal: <strong>{totalDetails.originalTotal} €</strong>
            </p>
            {parseFloat(totalDetails.totalSavings) > 0 && (
              <p style={{ 
                margin: '0 0 8px 0', 
                fontSize: '14px',
                color: '#6b8f71',
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
              color: '#6b8f71'
            }}>
              TOTAL: {totalDetails.discountedTotal} €
            </p>
          </div>

          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#8a7a68' }}>
            Total de productos: <strong>{cartItems.length}</strong>
          </p>

          <button 
            onClick={async () => {
              try {
                setIsCheckingOut(true);
                setCheckoutError(null);
                
                // Preparar datos de factura
                const invoiceInfo = {
                  items: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    totalPrice: item.quantity * parseFloat(calculatePriceWithUserDiscount(item).finalPrice)
                  })),
                  subtotal: parseFloat(totalDetails.originalTotal),
                  discount: parseFloat(totalDetails.totalSavings),
                  total: parseFloat(totalDetails.discountedTotal)
                };
                
                console.log('🔄 Iniciando checkout...');
                console.log('💰 Datos de factura:', invoiceInfo);
                
                // Realizar checkout
                await checkout(cartItems);
                
                console.log('✅ Checkout exitoso');
                console.log('📦 Guardando datos de factura...');
                
                // Guardar datos en localStorage
                localStorage.setItem('lastInvoice', JSON.stringify(invoiceInfo));
                
                // Calcular puntos ganados (1 punto por cada euro gastado)
                const pointsEarned = Math.floor(invoiceInfo.total);
                console.log('⭐ Puntos ganados:', pointsEarned);
                localStorage.setItem('lastPointsEarned', pointsEarned.toString());
                
                console.log('🧹 Limpiando carrito...');
                
                // Limpiar carrito
                clearCart();
                
                console.log('📊 Estado después de clearCart - isCheckingOut:', isCheckingOut);
                
                // Mostrar toast de éxito
                showToast('¡Pedido realizado con éxito! 🎉', 'success');
                
                console.log('✅ Toast mostrado');
                console.log('🚀 Navegando a factura...');
                console.log('   Destino: /invoice');
                
                // Navegación directa con window.location
                console.log('⏱️ Navegando con window.location.href...');
                window.location.href = '/invoice';
              } catch (err) {
                const errorMsg = cleanErrorMessage(err.response?.data?.message || err.message);
                setCheckoutError(`Error en la compra: ${errorMsg}`);
                showToast(`Error en la compra: ${errorMsg}`, 'error');
                console.error('❌ Error en checkout:', err);
              } finally {
                setIsCheckingOut(false);
              }
            }}
            disabled={isCheckingOut}
            style={{
              marginTop: '15px',
              padding: '12px 30px',
              background: isCheckingOut ? '#ccc' : 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: isCheckingOut ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: '700'
            }}
          >
            {isCheckingOut ? '⏳ Procesando...' : 'Finalizar Compra 💳'}
          </button>

          {checkoutError && (
            <p style={{ color: '#8a5a44', marginTop: '10px', fontSize: '14px' }}>
              {checkoutError}
            </p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default CartPage;