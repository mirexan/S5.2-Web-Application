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
            background: 'linear-gradient(90deg, #f7efe5 0%, #fbf4ea 25%, #f1e3d2 50%, #fbf4ea 75%, #f7efe5 100%)',
            borderTop: '3px solid #c9a968',
            borderBottom: '1px solid #e1d3bf',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.06)',
            padding: '4px 0',
            marginBottom: '0'
        }}>
            <style>
                {`
                    .subnav-container {
                        max-width: 1400px;
                        margin: 0 auto;
                        display: grid;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                        gap: 0;
                        padding: 0 10px;
                    }

                    .subnav-button {
                        min-width: 0;
                        width: 100%;
                        border-radius: 0 !important;
                        padding: 18px 10px !important;
                        border-left: 0 !important;
                        border-right: 1px solid rgba(176, 138, 90, 0.35) !important;
                        border-top: 0 !important;
                        border-bottom: 0 !important;
                        box-shadow: none !important;
                    }

                    .subnav-button:first-child {
                        border-left: 1px solid rgba(176, 138, 90, 0.35) !important;
                        border-radius: 0 !important;
                    }

                    .subnav-button:last-child {
                        border-right: 1px solid rgba(176, 138, 90, 0.35) !important;
                        border-radius: 0 !important;
                    }

                    @media (max-width: 720px) {
                        .subnav-container {
                            grid-template-columns: 1fr;
                            padding: 0 12px;
                        }

                        .subnav-button {
                            padding: 14px 12px !important;
                            font-size: 0.85em !important;
                            border-radius: 0 !important;
                            border: 0 !important;
                            border-top: 1px solid rgba(176, 138, 90, 0.35) !important;
                            margin: 0;
                        }
                    }

                    @media (max-width: 480px) {
                        .subnav-button {
                            font-size: 0.82em !important;
                        }
                    }
                `}
            </style>
            <div className="subnav-container">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                    <div
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="subnav-button"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                navigate(item.path);
                            }
                        }}
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
                            borderBottom: `3px solid ${isActive ? 'rgba(176, 138, 90, 0.9)' : 'rgba(176, 138, 90, 0.35)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            minWidth: '150px',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            boxShadow: isActive ? 'inset 0 -2px 0 rgba(176, 138, 90, 0.9)' : 'none',
                            userSelect: 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.color = '#3e2c1e';
                                e.currentTarget.style.borderBottom = '3px solid #b08a5a';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                                e.currentTarget.style.borderColor = 'rgba(176, 138, 90, 0.7)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.color = '#3e2c1e';
                                e.currentTarget.style.borderBottom = '3px solid rgba(176, 138, 90, 0.35)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                                e.currentTarget.style.borderColor = 'rgba(176, 138, 90, 0.35)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }
                        }}
                    >
                        {item.label}
                    </div>
                    );
                })}
            </div>
        </nav>
    );
}

export default SubNavbar;
