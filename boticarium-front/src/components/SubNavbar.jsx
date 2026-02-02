import { useNavigate } from 'react-router-dom';

function SubNavbar() {
    const navigate = useNavigate();

    const navItems = [
        { label: 'QUIÉNES SOMOS', icon: '🌱', path: '/about' },
        { label: 'PRODUCTOS', icon: '🌿', path: '/products' },
        { label: 'CONTACTO', icon: '📍', path: '/contact' }
    ];

    return (
        <nav style={{
            background: 'linear-gradient(90deg, #f5f1e8 0%, #efe7d8 50%, #f5f1e8 100%)',
            borderBottom: '1px solid #e1d3bf',
            padding: '0',
            marginBottom: '0'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
                gap: '40px',
                padding: '12px 20px'
            }}>
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#3e2c1e',
                            cursor: 'pointer',
                            fontSize: '0.95em',
                            fontWeight: '500',
                            padding: '8px 0',
                            transition: 'all 0.3s',
                            borderBottom: '2px solid transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#6b8f71';
                            e.currentTarget.style.borderBottom = '2px solid #6b8f71';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#3e2c1e';
                            e.currentTarget.style.borderBottom = '2px solid transparent';
                        }}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}

export default SubNavbar;
