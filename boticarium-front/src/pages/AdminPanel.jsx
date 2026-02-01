import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../utils/jwtUtils';
import { getAllProducts } from '../services/productService';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function AdminPanel() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
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
    imgUrl: ''
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
  }, [navigate]);

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
        imgUrl: ''
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
      imgUrl: product.imgUrl || ''
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
      imgUrl: ''
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

  if (loading) return <div style={{ padding: '20px' }}>⏳ Cargando...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>⚙️ Panel de Administración - Gestión de Productos</h1>

      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>{error}</div>}
      {success && <div style={{ background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>{success}</div>}

      {/* Formulario */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h2>{editingId ? '✏️ Editar Producto' : '➕ Crear Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <input
              type="text"
              name="name"
              placeholder="Nombre del producto"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
            <input
              type="text"
              name="description"
              placeholder="Descripción"
              value={formData.description}
              onChange={handleInputChange}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
            <input
              type="number"
              name="basePrice"
              placeholder="Precio base (€)"
              value={formData.basePrice}
              onChange={handleInputChange}
              step="0.01"
              required
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
            <input
              type="number"
              name="costPrice"
              placeholder="Precio de costo (€)"
              value={formData.costPrice}
              onChange={handleInputChange}
              step="0.01"
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
            <input
              type="number"
              name="stockQuantity"
              placeholder="Cantidad en stock"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              required
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />

            {/* Sección de Imagen */}
            <div style={{ borderTop: '2px solid #ddd', paddingTop: '15px', marginTop: '10px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                📸 Imagen del Producto
              </label>
              
              {/* Preview de imagen */}
              {imagePreview && (
                <div style={{ marginBottom: '10px' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '5px' }}
                  />
                </div>
              )}

              {/* Input file para subir */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px',
                  width: '100%'
                }}
              />
              {uploading && <p style={{ fontSize: '0.9em', color: '#666' }}>⏳ Subiendo imagen...</p>}

              {/* Alternativamente: URL manual */}
              <input
                type="text"
                name="imgUrl"
                placeholder="O ingresa URL de imagen manualmente"
                value={formData.imgUrl}
                onChange={handleInputChange}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginTop: '10px' }}
              />
            </div>

            <input
              type="number"
              name="discountLevel1"
              placeholder="Descuento Level 1 (%)"
              value={formData.discountLevel1}
              onChange={handleInputChange}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
            <input
              type="number"
              name="discountLevel2"
              placeholder="Descuento Level 2 (%)"
              value={formData.discountLevel2}
              onChange={handleInputChange}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
            <input
              type="number"
              name="discountLevel3"
              placeholder="Descuento Level 3 (%)"
              value={formData.discountLevel3}
              onChange={handleInputChange}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
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
  );
}

export default AdminPanel;
