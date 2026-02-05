import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, loginWithGoogle } from '../services/authService';
import { GoogleLogin } from '@react-oauth/google';
import { showToast } from '../components/Toast';

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
            showToast(`¡Bienvenido ${username}!`, 'success');
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
            showToast("Se ha iniciado sesión con Google", 'success');
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
            <h2 style={{ color: '#3f4f36', marginTop: 0 }}>Iniciar Sesión en Boticarium</h2>

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
                  width: '100%'
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #b08a5a 0%, #9a764b 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '700'
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
        </div>
    );
}
export default LoginPage;