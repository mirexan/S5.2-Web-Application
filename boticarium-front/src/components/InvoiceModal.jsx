import { useNavigate } from 'react-router-dom';

function InvoiceModal({ isOpen, onClose, orderData }) {
  const navigate = useNavigate();

  console.log('🎯 InvoiceModal render - isOpen:', isOpen, 'orderData:', orderData);

  if (!isOpen || !orderData) {
    console.log('❌ Modal not rendering - isOpen:', isOpen, 'orderData:', orderData);
    return null;
  }

  console.log('✅ Modal displaying with data:', orderData);

  const handleContinue = () => {
    console.log('🔄 Closing modal and navigating...');
    onClose();
    navigate('/products');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '999999',
      padding: '20px'
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          borderBottom: '2px solid #e1d3bf',
          paddingBottom: '20px',
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            color: '#6b8f71', 
            margin: '0 0 8px 0',
            fontSize: '1.8em',
            fontWeight: '700'
          }}>
            ✅ Pedido Realizado
          </h2>
          <p style={{ 
            color: '#8a7a68', 
            margin: 0,
            fontSize: '0.95em'
          }}>
            ¡Gracias por tu compra!
          </p>
        </div>

        {/* Información del pedido */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            color: '#5a4a3c', 
            fontSize: '1.1em',
            marginBottom: '12px',
            fontWeight: '600'
          }}>
            📦 Detalles del Pedido
          </h3>
          
          {/* Lista de productos */}
          <div style={{ 
            background: '#f7f3eb',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            {orderData.items.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: index < orderData.items.length - 1 ? '1px solid #e1d3bf' : 'none'
              }}>
                <span style={{ color: '#5a4a3c', fontWeight: '500' }}>
                  {item.quantity}x {item.name}
                </span>
                <span style={{ color: '#6b8f71', fontWeight: '700' }}>
                  {item.totalPrice.toFixed(2)} €
                </span>
              </div>
            ))}
          </div>

          {/* Resumen de totales */}
          <div style={{ 
            background: 'linear-gradient(135deg, #6b8f71 0%, #7a9b76 100%)',
            borderRadius: '10px',
            padding: '20px',
            color: 'white'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontSize: '0.95em'
            }}>
              <span>Subtotal:</span>
              <span>{orderData.subtotal.toFixed(2)} €</span>
            </div>
            {orderData.discount > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '0.95em',
                color: '#d4edda'
              }}>
                <span>Descuento:</span>
                <span>-{orderData.discount.toFixed(2)} €</span>
              </div>
            )}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              borderTop: '2px solid rgba(255,255,255,0.3)',
              paddingTop: '12px',
              fontSize: '1.3em',
              fontWeight: '700'
            }}>
              <span>Total:</span>
              <span>{orderData.total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Mensaje adicional */}
        <div style={{
          background: '#f0f9ff',
          border: '2px solid #6b8f71',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <p style={{ 
            color: '#5a4a3c', 
            margin: 0,
            lineHeight: '1.6'
          }}>
            📧 Recibirás un email de confirmación con los detalles de tu pedido.<br />
            🚚 Tu pedido está siendo procesado.
          </p>
        </div>

        {/* Botones */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleContinue}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1em',
              boxShadow: '0 4px 12px rgba(107, 143, 113, 0.3)'
            }}
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceModal;
