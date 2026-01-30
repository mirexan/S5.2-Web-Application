import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try{
           const response = await axios.post('http://localhost:8080/auth/login', {
                username,
                password
            });
            const token = response.data.token;
            localStorage.setItem('userToken', token);
            
            window.dispatchEvent(new Event("storage"));
            alert("¡Bienvenido " + username + "!");
            navigate('/products');
            window.location.reload();
        }
        catch (err){
            console.error(error);
            alert("Usuario o contraseña incorrectos");
        }
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

                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                  Entrar
                </button>
              </form>
            </div>
    );
}
export default LoginPage;