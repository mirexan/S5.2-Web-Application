import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserPoints } from '../utils/jwtUtils';

function InvoicePage() {
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const hasProcessed = useRef(false); // Bandera para evitar procesar dos veces

  useEffect(() => {
    console.log('📄 InvoicePage.useEffect: Iniciando...');
    
    // Solo procesar una vez
    if (hasProcessed.current) {
      console.log('⏭️ Ya fue procesado, saltando...');
      return;
    }
    
    // Obtener datos de la factura desde localStorage
    const savedInvoice = localStorage.getItem('lastInvoice');
    const savedPoints = localStorage.getItem('lastPointsEarned');
    
    console.log('🔍 localStorage.lastInvoice:', savedInvoice ? 'EXISTE' : 'NO EXISTE');
    console.log('🔍 localStorage.lastPointsEarned:', savedPoints ? savedPoints : 'NO EXISTE');
    
    if (!savedInvoice) {
      console.log('❌ No hay factura en localStorage - redirigiendo a carrito');
      // Si no hay factura, redirigir al carrito
      navigate('/cart');
      return;
    }

    // Marcar como procesado
    hasProcessed.current = true;

    try {
      const invoice = JSON.parse(savedInvoice);
      console.log('✅ Factura parseada correctamente:', invoice);
      console.log('⭐ Puntos a mostrar:', savedPoints);
      
      setInvoiceData(invoice);
      const pointsNum = savedPoints ? parseInt(savedPoints) : 0;
      console.log('⭐ Puntos parseados como número:', pointsNum);
      setPointsEarned(pointsNum);

      // Limpiar localStorage (la factura ya fue mostrada)
      localStorage.removeItem('lastInvoice');
      localStorage.removeItem('lastPointsEarned');
      console.log('🧹 localStorage limpiado');
    } catch (error) {
      console.error('❌ Error parseando factura:', error);
      navigate('/cart');
    }
  }, [navigate]);

  if (!invoiceData) {
    return (
      <div style={{ 
        background: 'linear-gradient(180deg, #f7f3eb 0%, #efe7d8 100%)', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  console.log('🎨 Renderizando InvoicePage - pointsEarned:', pointsEarned);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #f7f3eb 0%, #efe7d8 100%)',
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '700px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        {/* Título con icono */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            color: '#3f4f36',
            fontSize: '2.5em',
            margin: '0 0 10px 0'
          }}>
            ¡Pedido Confirmado!
          </h1>
          <p style={{
            color: '#5a4a3c',
            fontSize: '1.1em',
            margin: 0
          }}>
            Gracias por tu compra
          </p>
        </div>

        {/* Separador */}
        <hr style={{
          border: 'none',
          borderTop: '2px solid #e1d3bf',
          margin: '30px 0'
        }} />

        {/* Detalles de la factura */}
        <div style={{
          textAlign: 'left',
          marginBottom: '30px',
          background: '#f9f7f3',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e1d3bf'
        }}>
          <h3 style={{
            color: '#3f4f36',
            marginTop: 0,
            marginBottom: '15px',
            fontSize: '1.2em'
          }}>
            📦 Resumen de tu Pedido
          </h3>

          {/* Lista de productos */}
          <div style={{
            marginBottom: '20px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {invoiceData.items.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '10px',
                borderBottom: index < invoiceData.items.length - 1 ? '1px solid #e1d3bf' : 'none',
                marginBottom: '10px'
              }}>
                <div style={{
                  flex: 1,
                  textAlign: 'left'
                }}>
                  <p style={{
                    margin: '0',
                    fontWeight: '600',
                    color: '#3f4f36'
                  }}>
                    {item.name}
                  </p>
                  <p style={{
                    margin: '3px 0 0 0',
                    fontSize: '0.9em',
                    color: '#666'
                  }}>
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <div style={{
                  textAlign: 'right',
                  minWidth: '100px'
                }}>
                  <p style={{
                    margin: 0,
                    fontWeight: '700',
                    color: '#6b8f71',
                    fontSize: '1.1em'
                  }}>
                    {item.totalPrice ? parseFloat(item.totalPrice).toFixed(2) : '0.00'} €
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totales */}
        <div style={{
          background: 'linear-gradient(135deg, #f5f2ea 0%, #f0ede7 100%)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid #e1d3bf'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            paddingBottom: '10px',
            borderBottom: '1px solid #d4c3ab'
          }}>
            <span style={{ color: '#5a4a3c', fontWeight: '600' }}>Subtotal:</span>
            <span style={{ color: '#5a4a3c', fontWeight: '600' }}>
              {invoiceData.subtotal ? parseFloat(invoiceData.subtotal).toFixed(2) : '0.00'} €
            </span>
          </div>

          {invoiceData.discount && parseFloat(invoiceData.discount) > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              paddingBottom: '10px',
              borderBottom: '1px solid #d4c3ab',
              color: '#6b8f71',
              fontWeight: '700'
            }}>
              <span>💰 Descuento:</span>
              <span>-{parseFloat(invoiceData.discount).toFixed(2)} €</span>
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.3em',
            fontWeight: 'bold',
            color: '#6b8f71'
          }}>
            <span>TOTAL:</span>
            <span>{invoiceData.total ? parseFloat(invoiceData.total).toFixed(2) : '0.00'} €</span>
          </div>
        </div>

        {/* Puntos ganados */}
        {pointsEarned !== undefined && pointsEarned !== null && (
          <div style={{
            background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <p style={{
              margin: 0,
              fontSize: '1.1em',
              marginBottom: '10px'
            }}>
              ⭐ Puntos Obtenidos
            </p>
            <p style={{
              margin: 0,
              fontSize: '2em',
              fontWeight: 'bold'
            }}>
              +{pointsEarned || 0} puntos
            </p>
            <p style={{
              margin: '10px 0 0 0',
              fontSize: '0.9em',
              opacity: 0.9
            }}>
              Los puntos se añadirán a tu cuenta cuando el pedido sea completado.
              Acumular puntos te permitirá subir de nivel y acceder a mejores descuentos en futuras compras.
            </p>
          </div>
        )}

        {/* Información de entrega */}
        <div style={{
          background: '#f9f7f3',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e1d3bf',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <p style={{
            margin: '0 0 10px 0',
            fontSize: '0.95em',
            color: '#5a4a3c'
          }}>
            📧 Recibirás un email de confirmación con los detalles de tu pedido.<br />
            🚚 Tu pedido está siendo procesado y pronto será enviado.<br />
            📱 Puedes seguir el estado de tu pedido en <strong>Mi Perfil &gt; Mis Pedidos</strong>
          </p>
        </div>

        {/* Botón para continuar */}
        <button
          onClick={() => navigate('/products')}
          style={{
            padding: '14px 40px',
            background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '1.1em',
            boxShadow: '0 4px 12px rgba(107, 143, 113, 0.3)',
            transition: 'transform 0.2s',
            width: '100%'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Continuar Comprando
        </button>
      </div>
    </div>
  );
}

export default InvoicePage;
