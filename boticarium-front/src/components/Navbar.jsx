import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token');

    const handleLogout = () => {
        // Para salir, borramos el token y recargamos la página
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
                        <span>👤 Hola, Usuario</span>
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