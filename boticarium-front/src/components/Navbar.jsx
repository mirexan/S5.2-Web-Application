import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getUsername, isAdmin } from '../utils/jwtUtils';

function Navbar() {
    const navigate = useNavigate();
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
            padding: '10px 20px',
            backgroundColor: '#333',
            color: 'white',
            marginBottom: '20px'
        }}>
            {/* LOGO O NOMBRE DE LA TIENDA */}
            <div 
                style={{ fontSize: '1.5em', fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => navigate('/products')}
            >
                🌿 Boticarium
            </div>

            
            <div>
                {isLoggedIn ? (
                    // SI ESTÁ LOGUEADO: Muestra botón de Salir y Carrito
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <button
                            onClick={() => navigate('/cart')}
                            style={{ 
                                background: '#28a745', 
                                color: 'white', 
                                border: 'none', 
                                padding: '8px 15px', 
                                cursor: 'pointer', 
                                borderRadius: '4px',
                                position: 'relative',
                                fontWeight: 'bold'
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
                                    background: '#ff6b00', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '8px 15px', 
                                    cursor: 'pointer', 
                                    borderRadius: '4px',
                                    fontWeight: 'bold'
                                }}
                            >
                                ⚙️ Panel Admin
                            </button>
                        )}
                        <span>👤 Hola, {username}  {adminRole && <span style={{ background: '#ff6b00', padding: '2px 8px', borderRadius: '3px', marginLeft: '5px' }}>👑 ADMIN</span>}</span>
                        <button 
                            onClick={handleLogout}
                            style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                ) : (
                    // SI NO ESTÁ LOGUEADO: Muestra botón de Iniciar Sesión
                    <button 
                        onClick={() => navigate('/login')}
                        style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                        🔑 Iniciar Sesión
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;