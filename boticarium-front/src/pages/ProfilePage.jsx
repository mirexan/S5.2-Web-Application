import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUsername } from '../utils/jwtUtils';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const username = getUsername();
    if (!username) {
      navigate('/login');
      return;
    }
    fetchUserData();
    fetchUserOrders();
  }, [navigate]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
    
    // Escuchar cambios en el historial
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const newTab = urlParams.get('tab');
      if (newTab) {
        setActiveTab(newTab);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [searchParams]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (err) {
      setError('Error cargando datos del perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/users/profile`, userData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuccess('✅ Perfil actualizado correctamente');
      setEditing(false);
    } catch (err) {
      setError(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      setError(`❌ Error al eliminar cuenta: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Funciones para calcular nivel y progreso
  const getLevelInfo = (points) => {
    if (points >= 500) {
      return { level: 3, name: '🥇 Oro', nextLevel: null, pointsForNext: null, progress: 100, color: '#d4af37' };
    }
    if (points >= 200) {
      return { level: 2, name: '🥈 Plata', nextLevel: 3, pointsForNext: 500, progress: ((points - 200) / 300) * 100, color: '#c0c0c0' };
    }
    // Nivel 1 (Bronce): 0-199 puntos
    return { level: 1, name: '🥉 Bronce', nextLevel: 2, pointsForNext: 200, progress: (points / 200) * 100, color: '#cd7f32' };
  };

  if (loading) return <div style={{ padding: '20px' }}>⏳ Cargando...</div>;

  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    border: 'none',
    background: isActive ? '#6b8f71' : '#e0e0e0',
    color: isActive ? 'white' : '#333',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: isActive ? 'bold' : 'normal',
    borderRadius: isActive ? '8px 8px 0 0' : '0',
    transition: 'all 0.3s ease'
  });

  return (
    <div style={{
      background: 'linear-gradient(180deg, #f7f3eb 0%, #efe7d8 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ color: '#3f4f36', textAlign: 'center', marginBottom: '30px' }}>
          👤 Mi Perfil
        </h1>

        {/* Pestañas */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={tabStyle(activeTab === 'profile')}
          >
            ℹ️ Mi Información
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={tabStyle(activeTab === 'orders')}
          >
            📦 Mis Pedidos
          </button>
          <button
            onClick={() => setActiveTab('delete')}
            style={tabStyle(activeTab === 'delete')}
          >
            ⚠️ Peligro
          </button>
        </div>

        {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>{error}</div>}
        {success && <div style={{ background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>{success}</div>}

        {/* PESTAÑA: PERFIL */}
        {activeTab === 'profile' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ color: '#6b8f71', marginTop: 0 }}>
              {editing ? '✏️ Editar Información' : 'Tu Información'}
            </h2>
            
            {/* Barra de Progreso de Puntos */}
            {!editing && userData.points !== undefined && (() => {
              const levelInfo = getLevelInfo(userData.points);
              return (
                <div style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f3f0 100%)',
                  border: `2px solid ${levelInfo.color}`,
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '25px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#3f4f36', fontSize: '1.2em' }}>
                        {levelInfo.name}
                      </h3>
                      <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                        {userData.points} puntos acumulados
                      </p>
                    </div>
                    {levelInfo.nextLevel && (
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.85em' }}>Próximo nivel:</p>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', color: levelInfo.color }}>
                          {levelInfo.pointsForNext - userData.points} puntos restantes
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Barra de progreso */}
                  <div style={{
                    background: '#e0e0e0',
                    borderRadius: '20px',
                    height: '24px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      background: `linear-gradient(90deg, ${levelInfo.color} 0%, ${levelInfo.color}dd 100%)`,
                      height: '100%',
                      width: `${Math.min(levelInfo.progress, 100)}%`,
                      borderRadius: '20px',
                      transition: 'width 0.5s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85em', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                        {Math.round(levelInfo.progress)}%
                      </span>
                    </div>
                  </div>
                  
                  {levelInfo.nextLevel === null && (
                    <p style={{ marginTop: '12px', marginBottom: 0, textAlign: 'center', color: '#28a745', fontWeight: 'bold', fontSize: '0.95em' }}>
                      🎉 ¡Has alcanzado el nivel máximo!
                    </p>
                  )}
                </div>
              );
            })()}
            
            {!editing ? (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 'bold', color: '#8c6a3f' }}>Usuario:</label>
                  <p style={{ color: '#5a4a3c', fontSize: '16px' }}>{userData.username}</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 'bold', color: '#8c6a3f' }}>Email:</label>
                  <p style={{ color: '#5a4a3c', fontSize: '16px' }}>{userData.email}</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 'bold', color: '#8c6a3f' }}>Teléfono:</label>
                  <p style={{ color: '#5a4a3c', fontSize: '16px' }}>{userData.phone || 'No registrado'}</p>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✏️ Editar Información
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 'bold', color: '#8c6a3f', display: 'block', marginBottom: '5px' }}>
                    Usuario:
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e1d3bf',
                      borderRadius: '6px',
                      background: '#f5f5f5',
                      color: '#999'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 'bold', color: '#8c6a3f', display: 'block', marginBottom: '5px' }}>
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu correo electrónico"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e1d3bf',
                      borderRadius: '6px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 'bold', color: '#8c6a3f', display: 'block', marginBottom: '5px' }}>
                    Teléfono (ej: 34600000000):
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu número de teléfono"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e1d3bf',
                      borderRadius: '6px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    💾 Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    style={{
                      padding: '10px 20px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* PESTAÑA: PEDIDOS */}
        {activeTab === 'orders' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ color: '#6b8f71', marginTop: 0 }}>Mis Pedidos</h2>
            {orders.length === 0 ? (
              <p style={{ color: '#666', fontSize: '16px' }}>No tienes pedidos registrados</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>ID Pedido</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Estado</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #ddd', background: idx % 2 === 0 ? 'white' : '#f9f9f9' }}>
                        <td style={{ padding: '10px' }}>#{order.id}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#6b8f71' }}>{parseFloat(order.totalPrice || 0).toFixed(2)} €</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            background: order.status === 'COMPLETED' ? '#d4edda' : order.status === 'PENDING' ? '#fff3cd' : '#f8d7da',
                            color: order.status === 'COMPLETED' ? '#155724' : order.status === 'PENDING' ? '#856404' : '#721c24',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.9em',
                            fontWeight: 'bold'
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px' }}>{new Date(order.createdAt).toLocaleDateString('es-ES')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: ELIMINAR CUENTA */}
        {activeTab === 'delete' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #dc3545'
          }}>
            <h2 style={{ color: '#dc3545', marginTop: 0 }}>⚠️ Zona Peligrosa</h2>
            <p style={{ color: '#666', lineHeight: '1.8' }}>
              Si eliminas tu cuenta, <strong>todos tus datos serán borrados permanentemente</strong> y no podrás recuperarlos.
              Esta acción es <strong>irreversible</strong>.
            </p>
            
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  padding: '12px 24px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                🗑️ Eliminar Mi Cuenta
              </button>
            ) : (
              <div style={{
                background: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '8px',
                padding: '20px',
                marginTop: '20px'
              }}>
                <p style={{ color: '#721c24', fontWeight: 'bold', marginBottom: '15px' }}>
                  ¿Estás completamente seguro? Esta acción no se puede deshacer.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleDeleteAccount}
                    style={{
                      padding: '10px 20px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ✓ Sí, eliminar mi cuenta
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    style={{
                      padding: '10px 20px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ✕ Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
