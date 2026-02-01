import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, loginWithGoogle } from '../services/authService';
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            const data = await loginUser(username, password);
            const token = data.token;
            localStorage.setItem('token', token);
            
            window.dispatchEvent(new Event("storage"));
            alert("¡Bienvenido " + username + "!");
            navigate('/products');
            window.location.reload();
        }
        catch (err){
            console.error(err);
            setError('Usuario o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        setLoading(true);

        try {
            const data = await loginWithGoogle(credentialResponse.credential);
            const token = data.token;
            localStorage.setItem('token', token);
            
            window.dispatchEvent(new Event("storage"));
            alert("Se ha iniciado sesión con Google");
            navigate('/products');
            window.location.reload();
        } catch (err) {
            console.error(err);
            setError('Inicio de sesión con Google fallido');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Error al autenticar con Google');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
              <h2>Iniciar Sesión en Boticarium</h2>

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
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    style={{
                      padding: '10px 20px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    📝 Crear cuenta
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                    />
                  </div>
                </div>
              </form>
            </div>
    );
}
export default LoginPage;