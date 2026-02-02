import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await registerUser(username, email, password);
            const token = data.token;
            localStorage.setItem('token', token);

            window.dispatchEvent(new Event("storage"));
            alert("¡Cuenta creada! Bienvenida " + username + "");
            navigate('/products');
            window.location.reload();
        } catch (err) {
            console.error(err);
            setError('No se pudo registrar. Revisa los datos o si el usuario ya existe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(180deg, #f7f3eb 0%, #efe7d8 100%)',
            minHeight: '100vh',
            padding: '40px 20px'
        }}>
            <div style={{
                maxWidth: '420px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
            }}>
                <h2 style={{ color: '#3f4f36', marginTop: 0 }}>Crear cuenta en Boticarium</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ color: '#5a4a3c', fontWeight: '600' }}>Usuario:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e1d3bf' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ color: '#5a4a3c', fontWeight: '600' }}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e1d3bf' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ color: '#5a4a3c', fontWeight: '600' }}>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e1d3bf' }}
                            required
                        />
                    </div>

                    {error && <p style={{ color: '#8a5a44', fontWeight: '600' }}>{error}</p>}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '11px 20px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                                border: 'none',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)',
                                color: 'white',
                                fontWeight: '700',
                                flex: 1
                            }}
                        >
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '11px 20px',
                                cursor: 'pointer',
                                border: '1px solid #d8c7ae',
                                borderRadius: '10px',
                                background: '#f5f2ea',
                                color: '#5a4a3c',
                                fontWeight: '700'
                            }}
                        >
                            Volver
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
