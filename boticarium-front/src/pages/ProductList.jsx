import { useEffect, useState } from 'react';
import { getAllProducts } from '../services/productService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } 
            catch (err) {
                console.error(err);
                setError('Error fetching products (Revise if backend is running)');
            } 
            finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [location]);

    const handleAddToCart = (product) => {
        // Validar stock
        if (!product.stockQuantity || product.stockQuantity <= 0) {
            alert(`❌ Lo sentimos, "${product.name}" está agotado.`);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
           const irAlLogin = window.confirm("🔒 Para comprar necesitas identificarte.\n¿Quieres ir a la pantalla de login ahora?");
            if (irAlLogin) {
                navigate('/login');
            }
            return;
        }
        
        addToCart(product);
        alert(`✅ ${product.name} añadido al carrito! (Stock disponible: ${product.stockQuantity - 1})`);
    };
    if (loading) return <div style={{padding: '20px'}}>Loading products... ⏳</div>;
    if (error) return <div style={{padding: '20px', color: 'red'}}>❌ {error}</div>;
    return (
        <div style={{ padding: '20px' }}>
            <h1>Catálogo Boticarium</h1>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {products.map((product) => (
                    <div key={product.id} style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '10px', 
                        width: '250px',
                        overflow: 'hidden', // Para que la imagen no se salga
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* IMAGEN desde BD (imgUrl) o fallback */}
                        <img 
                            src={product.imgUrl || `https://picsum.photos/seed/${product.id}/200/200`} 
                            alt={product.name}
                            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                            onError={(e) => {
                                // Si la imagen falla, usar placeholder
                                e.target.src = `https://picsum.photos/seed/${product.id}/200/200`;
                            }}
                        />
                        
                        <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                            <p style={{ color: '#666', fontSize: '0.9em', flexGrow: 1 }}>{product.description}</p>
                            
                            <div style={{ marginTop: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#333' }}>{product.basePrice} €</span>
                                    <span style={{ fontSize: '0.8em', color: product.stockStatus === 'AVAILABLE' ? 'green' : 'red' }}>
                                        {product.stockStatus === 'AVAILABLE' ? '🟢 Stock' : '🔴 Agotado'}
                                    </span>
                                </div>

                                <button 
                                    onClick={() => handleAddToCart(product)}
                                    disabled={!product.stockQuantity || product.stockQuantity <= 0}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        background: (!product.stockQuantity || product.stockQuantity <= 0) ? '#ccc' : '#28a745', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '5px',
                                        cursor: (!product.stockQuantity || product.stockQuantity <= 0) ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {(!product.stockQuantity || product.stockQuantity <= 0) ? '❌ Agotado' : 'Añadir al Carrito 🛒'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;