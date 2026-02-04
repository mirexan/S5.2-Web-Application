import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { getUsername, isAdmin } from '../utils/jwtUtils';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const { getCartItemsCount } = useCart();
    const isLoggedIn = localStorage.getItem('token');
    const username = getUsername();
    const adminRole = isAdmin();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 24px',
            backgroundImage: 'linear-gradient(90deg, #efe2cf 0%, #f5eadb 25%, #e7d3b6 50%, #f5eadb 75%, #efe2cf 100%), linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
            backgroundSize: '120% 100%, 100% 100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            color: '#3e2c1e',
            marginBottom: '0'
        }}>
            {/* LOGO O NOMBRE DE LA TIENDA */}
            <div 
              style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', cursor: 'pointer' }}
                onClick={() => navigate('/products')}
            >
                <img 
                    src="/logo.png" 
                    alt="Boticarium Logo" 
                style={{ height: '40px', width: 'auto', display: 'block' }}
                />
              <span style={{ fontSize: '1.6em', fontWeight: '700', letterSpacing: '0.5px', lineHeight: '1' }}>
                    Boticarium
                </span>
            </div>

            <div>
                {isLoggedIn ? (
                    // SI ESTÁ LOGUEADO: Muestra botón de Salir y Carrito
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <button
                            onClick={() => navigate('/cart')}
                            style={{ 
                                background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)', 
                                color: 'white', 
                                border: 'none', 
                                padding: '9px 16px', 
                                cursor: 'pointer', 
                                borderRadius: '8px',
                                position: 'relative',
                                fontWeight: '600',
                                boxShadow: '0 4px 10px rgba(107, 143, 113, 0.35)'
                            }}
                        >
                            🛒 Carrito
                            {getCartItemsCount() > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: 'red',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '22px',
                                    height: '22px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {getCartItemsCount()}
                                </span>
                            )}
                        </button>
                        {adminRole && (
                            <button
                                onClick={() => navigate('/admin')}
                                style={{ 
                                    background: 'linear-gradient(135deg, #b08a5a 0%, #9a764b 100%)', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '9px 16px', 
                                    cursor: 'pointer', 
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 10px rgba(176, 138, 90, 0.3)'
                                }}
                            >
                                ⚙️ Panel Admin
                            </button>
                        )}
                        <div style={{ position: 'relative' }}>
                          <div
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                            onClick={() => {
                              setShowDropdown(!showDropdown);
                              if (!showDropdown) return;
                              navigate('/profile');
                              setShowDropdown(false);
                            }}
                            style={{
                              color: '#3e2c1e',
                              fontWeight: '600',
                              cursor: 'pointer',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: showDropdown ? 'rgba(107, 143, 113, 0.15)' : 'transparent',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            👤 {username}
                            {adminRole && <span style={{ background: '#b08a5a', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85em' }}>🎓</span>}
                            {showDropdown && <span>▼</span>}
                          </div>
                          
                          {showDropdown && (
                            <div
                              onMouseEnter={() => setShowDropdown(true)}
                              onMouseLeave={() => setShowDropdown(false)}
                              style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                background: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                                zIndex: 1000,
                                minWidth: '200px',
                                overflow: 'hidden'
                              }}
                            >
                              <button
                                onClick={() => {
                                  if (location.pathname === '/profile') {
                                    window.history.pushState({}, '', '/profile?tab=profile');
                                    window.dispatchEvent(new Event('popstate'));
                                  } else {
                                    navigate('/profile?tab=profile');
                                  }
                                  setShowDropdown(false);
                                }}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: 'none',
                                  background: 'transparent',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  color: '#3e2c1e',
                                  fontSize: '14px',
                                  borderBottom: '1px solid #eee',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                              >
                                ✏️ Mi Información
                              </button>
                              <button
                                onClick={() => {
                                  if (location.pathname === '/profile') {
                                    window.history.pushState({}, '', '/profile?tab=orders');
                                    window.dispatchEvent(new Event('popstate'));
                                  } else {
                                    navigate('/profile?tab=orders');
                                  }
                                  setShowDropdown(false);
                                }}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: 'none',
                                  background: 'transparent',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  color: '#3e2c1e',
                                  fontSize: '14px',
                                  borderBottom: '1px solid #eee',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                              >
                                📦 Mis Pedidos
                              </button>
                              <button
                                onClick={handleLogout}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: 'none',
                                  background: 'transparent',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  color: '#a0533f',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                              >
                                🚪 Cerrar Sesión
                              </button>
                            </div>
                          )}
                        </div>
                    </div>
                ) : (
                    // SI NO ESTÁ LOGUEADO: Muestra botón de Iniciar Sesión
                    <button 
                        onClick={() => navigate('/login')}
                        style={{ background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)', color: 'white', border: 'none', padding: '9px 16px', cursor: 'pointer', borderRadius: '8px', fontWeight: '600', boxShadow: '0 4px 10px rgba(107, 143, 113, 0.35)' }}
                    >
                        🔑 Iniciar Sesión
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;