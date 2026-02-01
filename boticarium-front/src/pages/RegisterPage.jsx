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
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Crear cuenta en Boticarium</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                        required
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    style={{
                        marginLeft: '10px',
                        padding: '10px 20px',
                        cursor: 'pointer'
                    }}
                >
                    Volver
                </button>
            </form>
        </div>
    );
}

export default RegisterPage;
