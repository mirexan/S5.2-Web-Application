import { useNavigate, useLocation } from 'react-router-dom';

function SubNavbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'QUIÉNES SOMOS', path: '/about' },
        { label: 'PRODUCTOS', path: '/products' },
        { label: 'CONTACTO', path: '/contact' }
    ];

    return (
        <nav style={{
            background: 'linear-gradient(90deg, #efe2cf 0%, #f5eadb 25%, #e7d3b6 50%, #f5eadb 75%, #efe2cf 100%)',
            borderTop: '3px solid #c9a968',
            borderBottom: '1px solid #e1d3bf',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.06)',
            padding: '4px 0',
            marginBottom: '0'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
                gap: '22px',
                padding: '10px 20px'
            }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            background: isActive ? 'rgba(176, 138, 90, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                            border: `1px solid ${isActive ? 'rgba(176, 138, 90, 0.8)' : 'rgba(176, 138, 90, 0.35)'}`,
                            color: isActive ? '#2d1f15' : '#3e2c1e',
                            cursor: 'pointer',
                            fontSize: '0.95em',
                            fontWeight: '600',
                            letterSpacing: '0.6px',
                            padding: '10px 22px',
                            transition: 'all 0.3s',
                            borderBottom: `2px solid ${isActive ? 'rgba(176, 138, 90, 0.9)' : 'rgba(176, 138, 90, 0.35)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            minWidth: '150px',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            boxShadow: isActive ? '0 4px 10px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.12)'
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.color = '#3e2c1e';
                                e.currentTarget.style.borderBottom = '2px solid #b08a5a';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                                e.currentTarget.style.borderColor = 'rgba(176, 138, 90, 0.7)';
                                e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.16)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.color = '#3e2c1e';
                                e.currentTarget.style.borderBottom = '2px solid rgba(176, 138, 90, 0.35)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                                e.currentTarget.style.borderColor = 'rgba(176, 138, 90, 0.35)';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }
                        }}
                    >
                        {item.label}
                    </button>
                    );
                })}
            </div>
        </nav>
    );
}

export default SubNavbar;
