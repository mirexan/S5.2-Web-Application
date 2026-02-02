import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function Footer() {
    const navigate = useNavigate();

    return (
        <footer style={{
            background: 'linear-gradient(180deg, #3e2c1e 0%, #2d1f15 100%)',
            color: '#f7f3eb',
            padding: '40px 20px 20px',
            marginTop: '60px'
        }}>
            <div style={{ 
                maxWidth: '1400px', 
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '40px',
                marginBottom: '30px'
            }}>
                {/* Sección Boticarium */}
                <div>
                    <h3 style={{ 
                        color: '#e7d3b6', 
                        marginBottom: '15px',
                        fontSize: '1.3em',
                        fontWeight: '600'
                    }}>
                        🌿 Boticarium
                    </h3>
                    <p style={{ 
                        color: '#d4c3ab',
                        lineHeight: '1.6',
                        fontSize: '0.95em'
                    }}>
                        Tu herboristería de confianza. Productos naturales de la más alta calidad 
                        para tu bienestar.
                    </p>
                </div>

                {/* Imagen más grande */}
                <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
                    <img 
                        src={`${API_URL}/images/interior.png`}
                        alt="Interior de Boticarium" 
                        style={{ 
                            maxWidth: '100%',
                            maxHeight: '180px', 
                            height: 'auto', 
                            borderRadius: '8px',
                            opacity: '0.9',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                        }}
                        onError={(e) => e.target.style.display = 'none'}
                    />
                </div>

                {/* Información de contacto */}
                <div>
                    <h4 style={{ 
                        color: '#e7d3b6', 
                        marginBottom: '15px',
                        fontSize: '1.1em',
                        fontWeight: '600'
                    }}>
                        Contacto
                    </h4>
                    <div style={{ color: '#d4c3ab', fontSize: '0.95em', lineHeight: '1.8' }}>
                        <p style={{ margin: '5px 0' }}>📧 info@boticarium.es</p>
                        <p style={{ margin: '5px 0' }}>📞 +34 123 456 789</p>
                        <p style={{ margin: '5px 0' }}>📍 Valencia, España</p>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div style={{
                borderTop: '1px solid rgba(231, 211, 182, 0.2)',
                paddingTop: '20px',
                textAlign: 'center',
                color: '#b08a5a',
                fontSize: '0.9em'
            }}>
                <p style={{ margin: 0 }}>
                    © {new Date().getFullYear()} Boticarium. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
