import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../utils/jwtUtils';
import { getAllProducts } from '../services/productService';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentOrderPage, setCurrentOrderPage] = useState(0);
  const [totalOrderPages, setTotalOrderPages] = useState(0);
  const ITEMS_PER_PAGE = 15;
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    costPrice: '',
    discountLevel1: 0,
    discountLevel2: 0,
    discountLevel3: 0,
    stockQuantity: '',
    imgUrl: '',
    ingredients: '',
    usageInstructions: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Verificar si es admin
  useEffect(() => {
    if (!isAdmin()) {
      alert('❌ No tienes permiso para acceder al panel de administración');
      navigate('/products');
    }
    fetchProducts();
    fetchOrders(0);
    fetchUsers();
  }, [navigate]);

  const fetchOrders = async (page = 0) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/management?page=${page}&size=${ITEMS_PER_PAGE}&sort=createdAt,desc`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Si el response es un array, conviértelo a formato de página
      if (Array.isArray(response.data)) {
        setOrders(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setTotalOrderPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
      } else if (response.data.content) {
        setOrders(response.data.content);
        setTotalOrderPages(response.data.totalPages);
      } else {
        setOrders(response.data);
      }
      setCurrentOrderPage(page);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Error cargando productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Quantity') || name.includes('Level') || name.includes('Price') 
        ? (value === '' ? '' : parseFloat(value))
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      if (editingId) {
        // Update
        await axios.put(`${API_URL}/products/${editingId}`, formData, { headers });
        setSuccess(`✅ Producto actualizado correctamente`);
      } else {
        // Create
        await axios.post(`${API_URL}/products`, formData, { headers });
        setSuccess(`✅ Producto creado correctamente`);
      }

      // Reset form y recargar
      setFormData({
        name: '',
        description: '',
        basePrice: '',
        costPrice: '',
        discountLevel1: 0,
        discountLevel2: 0,
        discountLevel3: 0,
        stockQuantity: '',
        imgUrl: '',
        ingredients: '',
        usageInstructions: ''
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(`❌ Error: ${err.response?.data?.message || err.message}`);
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setImagePreview(product.imgUrl || null);
    setFormData({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      costPrice: product.costPrice || '',
      discountLevel1: product.discountLevel1 || 0,
      discountLevel2: product.discountLevel2 || 0,
      discountLevel3: product.discountLevel3 || 0,
      stockQuantity: product.stockQuantity || '',
      imgUrl: product.imgUrl || '',
      ingredients: product.ingredients || '',
      usageInstructions: product.usageInstructions || ''
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formDataWithFile = new FormData();
      formDataWithFile.append('file', file);

      const response = await axios.post(`${API_URL}/uploads/image`, formDataWithFile, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const imageUrl = response.data.url;
      setFormData(prev => ({ ...prev, imgUrl: imageUrl }));
      setImagePreview(imageUrl);
    } catch (err) {
      setError(`❌ Error al subir imagen: ${err.response?.data?.error || err.message}`);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      basePrice: '',
      costPrice: '',
      discountLevel1: 0,
      discountLevel2: 0,
      discountLevel3: 0,
      stockQuantity: '',
      imgUrl: '',
      ingredients: '',
      usageInstructions: ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuccess('✅ Producto eliminado correctamente');
      fetchProducts();
    } catch (err) {
      setError(`❌ Error al eliminar: ${err.message}`);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuccess('✅ Usuario eliminado correctamente');
      fetchUsers();
    } catch (err) {
      setError(`❌ Error al eliminar usuario: ${err.message}`);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/orders/management/${orderId}/status`, { status: newStatus }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuccess(`✅ Pedido actualizado a ${newStatus}`);
      fetchOrders(currentOrderPage);
    } catch (err) {
      setError(`❌ Error al actualizar pedido: ${err.message}`);
    }
  };

  const handleContactClient = (phone) => {
    if (!phone) {
      setError('❌ El cliente no tiene teléfono registrado');
      return;
    }
    window.open(`https://wa.me/${phone}`, '_blank');
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
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>⚙️ Panel de Administración</h1>

      {/* Pestañas */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('products')}
          style={tabStyle(activeTab === 'products')}
        >
          📦 Productos
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={tabStyle(activeTab === 'orders')}
        >
          🛒 Pedidos
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={tabStyle(activeTab === 'users')}
        >
          👥 Usuarios
        </button>
      </div>

      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>{error}</div>}
      {success && <div style={{ background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>{success}</div>}

      {/* PESTAÑA: PRODUCTOS */}
      {activeTab === 'products' && (
        <div>
          {/* Formulario */}
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h2>{editingId ? '✏️ Editar Producto' : '➕ Crear Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#6b8f71' }}>
                🏷️ Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ej: Té de manzanilla"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#6b8f71' }}>
                📦 Cantidad en Stock *
              </label>
              <input
                type="number"
                name="stockQuantity"
                placeholder="Cantidad en stock"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#6b8f71' }}>
                📝 Descripción
              </label>
              <input
                type="text"
                name="description"
                placeholder="Descripción"
                value={formData.description}
                onChange={handleInputChange}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#6b8f71' }}>
                💰 Precio Base (€) *
              </label>
              <input
                type="number"
                name="basePrice"
                placeholder="Precio base (€)"
                value={formData.basePrice}
                onChange={handleInputChange}
                step="0.01"
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#8c6a3f' }}>
                🏭 Precio de Coste (€)
              </label>
              <input
                type="number"
                name="costPrice"
                placeholder="Ej: 15.50 (para calcular el margen de beneficio)"
                value={formData.costPrice}
                onChange={handleInputChange}
                step="0.01"
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
              />
            </div>
          </div>

          {/* Resumen de Margen de Beneficio */}
          {formData.costPrice && formData.basePrice && (
            <div style={{
              background: '#f0f9ff',
              border: '2px solid #6b8f71',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#6b8f71', marginTop: 0, marginBottom: '10px' }}>📊 Análisis de Precios</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', fontSize: '0.95em' }}>
                <div>
                  <span style={{ color: '#666', fontSize: '0.85em' }}>Coste:</span>
                  <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#8c6a3f', fontSize: '1.15em' }}>
                    {parseFloat(formData.costPrice).toFixed(2)} €
                  </p>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '0.85em' }}>Precio Base:</span>
                  <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#6b8f71', fontSize: '1.15em' }}>
                    {parseFloat(formData.basePrice).toFixed(2)} €
                  </p>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '0.85em' }}>Margen de Beneficio:</span>
                  <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#28a745', fontSize: '1.15em' }}>
                    {((formData.basePrice - formData.costPrice) / formData.costPrice * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Descuentos por Nivel */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#6b8f71', marginBottom: '12px' }}>🎯 Descuentos por Nivel</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '15px'
            }}>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#6b8f71' }}>
                  🥉 Nivel 1 (%)
                </label>
                <input
                  type="number"
                  name="discountLevel1"
                  placeholder="Descuento Nivel 1"
                  value={formData.discountLevel1}
                  onChange={handleInputChange}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#6b8f71' }}>
                  🥈 Nivel 2 (%)
                </label>
                <input
                  type="number"
                  name="discountLevel2"
                  placeholder="Descuento Nivel 2"
                  value={formData.discountLevel2}
                  onChange={handleInputChange}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#6b8f71' }}>
                  🥇 Nivel 3 (%)
                </label>
                <input
                  type="number"
                  name="discountLevel3"
                  placeholder="Descuento Nivel 3"
                  value={formData.discountLevel3}
                  onChange={handleInputChange}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Sección de Imagen */}
          <div style={{ 
            background: '#fafafa', 
            border: '2px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px' 
          }}>
            <h4 style={{ color: '#6b8f71', marginTop: 0, marginBottom: '15px' }}>📸 Imagen del Producto</h4>
            
            {/* Preview de imagen */}
            {imagePreview && (
              <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                />
              </div>
            )}

            {/* Subir nueva imagen */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#333' }}>
                📤 Subir Nueva Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ 
                  padding: '10px', 
                  border: '2px solid #6b8f71', 
                  borderRadius: '5px',
                  width: '100%'
                }}
              />
              {uploading && <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>⏳ Subiendo imagen...</p>}
            </div>

            {/* O URL manual */}
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#333' }}>
                🔗 O Ingresa la Ruta de la Imagen Manualmente
              </label>
              <p style={{ fontSize: '0.85em', color: '#666', marginBottom: '8px' }}>
                💡 Las imágenes subidas se guardan en: <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>/uploads/</code>
              </p>
              <input
                type="text"
                name="imgUrl"
                placeholder="Ej: /uploads/te-manzanilla.jpg"
                value={formData.imgUrl}
                onChange={handleInputChange}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <textarea
              name="ingredients"
              placeholder="📋 Ingredientes (uno por línea)"
              value={formData.ingredients}
              onChange={handleInputChange}
              rows="6"
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'monospace' }}
            />
            <textarea
              name="usageInstructions"
              placeholder="📝 Instrucciones de uso"
              value={formData.usageInstructions}
              onChange={handleInputChange}
              rows="6"
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'monospace' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {editingId ? '💾 Actualizar' : '➕ Crear'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '10px 20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

          {/* Listado de productos */}
          <h2>📦 Productos Existentes</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
              <thead>
                <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Nombre</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Precio</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Stock</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>L1 / L2 / L3</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #ddd', background: idx % 2 === 0 ? 'white' : '#f9f9f9' }}>
                    <td style={{ padding: '10px' }}>{product.name}</td>
                    <td style={{ padding: '10px' }}>{product.basePrice} €</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: product.stockQuantity > 0 ? 'green' : 'red' }}>
                      {product.stockQuantity}
                    </td>
                    <td style={{ padding: '10px', fontSize: '0.9em' }}>
                      {product.discountLevel1 || 0}% / {product.discountLevel2 || 0}% / {product.discountLevel3 || 0}%
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(product)}
                        style={{
                          padding: '5px 10px',
                          background: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        style={{
                          padding: '5px 10px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PESTAÑA: PEDIDOS */}
      {activeTab === 'orders' && (
        <div>
          <h2>🛒 Gestión de Pedidos</h2>
          {orders.length === 0 ? (
            <p style={{ color: '#666', fontSize: '16px' }}>No hay pedidos registrados</p>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Usuario</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Estado</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #ddd', background: idx % 2 === 0 ? 'white' : '#f9f9f9' }}>
                        <td style={{ padding: '10px' }}>{order.id}</td>
                        <td style={{ padding: '10px' }}>{order.user?.username || 'N/A'}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{parseFloat(order.totalPrice || 0).toFixed(2)} €</td>
                        <td style={{ padding: '10px' }}>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid #ddd',
                              background: order.status === 'COMPLETED' ? '#d4edda' : order.status === 'PENDING' ? '#fff3cd' : '#f8d7da',
                              color: order.status === 'COMPLETED' ? '#155724' : order.status === 'PENDING' ? '#856404' : '#721c24',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td style={{ padding: '10px' }}>{new Date(order.createdAt).toLocaleDateString('es-ES')}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleContactClient(order.user?.phone)}
                            style={{
                              padding: '5px 10px',
                              background: '#25D366',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              marginRight: '5px'
                            }}
                          >
                            💬 Contactar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalOrderPages > 1 && (
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => fetchOrders(currentOrderPage - 1)}
                    disabled={currentOrderPage === 0}
                    style={{
                      padding: '8px 12px',
                      background: currentOrderPage === 0 ? '#ccc' : '#6b8f71',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: currentOrderPage === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ← Anterior
                  </button>
                  {Array.from({ length: totalOrderPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => fetchOrders(i)}
                      style={{
                        padding: '8px 12px',
                        background: currentOrderPage === i ? '#6b8f71' : '#f0f0f0',
                        color: currentOrderPage === i ? 'white' : '#333',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: currentOrderPage === i ? 'bold' : 'normal'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => fetchOrders(currentOrderPage + 1)}
                    disabled={currentOrderPage === totalOrderPages - 1}
                    style={{
                      padding: '8px 12px',
                      background: currentOrderPage === totalOrderPages - 1 ? '#ccc' : '#6b8f71',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: currentOrderPage === totalOrderPages - 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* PESTAÑA: USUARIOS */}
      {activeTab === 'users' && (
        <div>
          <h2>👥 Gestión de Usuarios</h2>
          {users.length === 0 ? (
            <p style={{ color: '#666', fontSize: '16px' }}>No hay usuarios registrados</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Usuario</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Rol</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Fecha Registro</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #ddd', background: idx % 2 === 0 ? 'white' : '#f9f9f9' }}>
                      <td style={{ padding: '10px' }}>{user.id}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{user.username}</td>
                      <td style={{ padding: '10px' }}>{user.email}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          background: user.role === 'ADMIN' ? '#cce5ff' : '#e8f0e4',
                          color: user.role === 'ADMIN' ? '#004085' : '#155724',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.9em',
                          fontWeight: 'bold'
                        }}>
                          {user.role === 'ADMIN' ? '🎓 ' : ''}{user.role}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>{new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={{
                            padding: '5px 10px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
