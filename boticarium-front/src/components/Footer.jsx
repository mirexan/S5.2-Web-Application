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
                gridTemplateColumns: 'auto auto 1fr',
                gap: '50px',
                marginBottom: '30px',
                justifyItems: 'start'
            }}>
                {/* Sección Boticarium */}
                <div>
                    <h3 style={{ 
                        color: '#e7d3b6', 
                        marginBottom: '15px',
                        fontSize: '1.3em',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '10px',
                        lineHeight: '1'
                    }}>
                        <img 
                            src="/logo.png" 
                            alt="Boticarium Logo" 
                            style={{ height: '32px', width: 'auto', filter: 'brightness(1.2)', flexShrink: 0, display: 'block' }}
                        />
                        Boticarium
                    </h3>
                    <p style={{ 
                        color: '#d4c3ab',
                        lineHeight: '1.6',
                        fontSize: '0.95em'
                    }}>
                        Somos una empresa familiar que une la Bioquímica y la Nutrición para recuperar el origen farmacológico de la fitoterapia. Seleccionamos el principio activo exacto y la dosis efectiva, separando la ciencia del mito.
                    </p>
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
                    <div style={{ color: '#d4c3ab', fontSize: '0.9em', lineHeight: '1.7' }}>
                        <p style={{ margin: '8px 0', fontWeight: '600' }}>📍 Carrer de la Conca de Tremp, 20 Bis<br/>08032 Barcelona</p>
                        <p style={{ margin: '8px 0' }}>📞 93 429 25 47</p>
                        <p style={{ margin: '8px 0' }}>📧 admin@herbologie.cat</p>
                        <p style={{ margin: '12px 0 5px 0', fontWeight: '600', color: '#e7d3b6' }}>HORARIOS</p>
                        <p style={{ margin: '3px 0' }}>Lunes a viernes: 9:15 - 14:00 / 17:00 - 20:00h</p>
                        <p style={{ margin: '3px 0' }}>Sábados: 9:15 - 14:00h</p>
                    </div>
                </div>

                {/* Imagen más grande */}
                <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '20px 0', width: '100%' }}>
                    <img 
                        src={`${API_URL}/images/interior2.jpg`}
                        alt="Interior de Boticarium" 
                        style={{ 
                            maxWidth: '340px',
                            minWidth: '220px',
                            maxHeight: '220px', 
                            height: 'auto', 
                            borderRadius: '8px',
                            opacity: '0.9',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                        }}
                        onError={(e) => e.target.style.display = 'none'}
                    />
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
