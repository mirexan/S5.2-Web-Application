import { useEffect, useState } from 'react';
import { getAllProducts } from '../services/productService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getLevel } from '../utils/jwtUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [userLevel, setUserLevel] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();

    useEffect(() => {
        const level = getLevel();
        console.log('🔍 DEBUG - Nivel de usuario:', level);
        setUserLevel(level);
    }, []);

    const getPriceWithDiscount = (basePrice, discount) => {
        return basePrice * (1 - discount / 100);
    };

    const getDiscountForLevel = (product) => {
        let discount = 0;
        if (userLevel >= 3) discount = product.discountLevel3 || 0;
        else if (userLevel >= 2) discount = product.discountLevel2 || 0;
        else if (userLevel >= 1) discount = product.discountLevel1 || 0;
        console.log(`📊 Producto: ${product.name} | Nivel usuario: ${userLevel} | Descuento actual: ${discount}% | Desc.Nv1: ${product.discountLevel1} | Desc.Nv2: ${product.discountLevel2} | Desc.Nv3: ${product.discountLevel3}`);
        return discount;
    };

    const getNextDiscount = (product) => {
        // Si es nivel 3 (máximo), no hay siguiente nivel
        if (userLevel >= 3) return null;
        
        // Para cada nivel, muestra el descuento del siguiente nivel disponible
        if (userLevel >= 2) return product.discountLevel3 || 0;
        if (userLevel >= 1) return product.discountLevel2 || 0;
        
        return 0;
    };

    const getNextLevelName = () => {
        if (userLevel >= 3) return null;
        return 'Próximo nivel';
    };


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
                // Inicializar cantidades a 1 para cada producto
                const initialQuantities = {};
                data.forEach(product => {
                    initialQuantities[product.id] = 1;
                });
                setQuantities(initialQuantities);
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

    const handleQuantityChange = (productId, change) => {
        const product = products.find(p => p.id === productId);
        const currentQty = quantities[productId] || 1;
        const newQty = currentQty + change;

        // No permitir cantidad menor a 1 ni mayor al stock disponible
        if (newQty >= 1 && newQty <= product.stockQuantity) {
            setQuantities({
                ...quantities,
                [productId]: newQty
            });
        }
    };

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
        
        const qty = quantities[product.id] || 1;
        for (let i = 0; i < qty; i++) {
            addToCart(product);
        }
        alert(`✅ ${qty}x ${product.name} añadido al carrito!`);
        // Resetear cantidad a 1
        setQuantities({
            ...quantities,
            [product.id]: 1
        });
    };
    if (loading) return <div style={{padding: '20px'}}>Loading products... ⏳</div>;
    if (error) return <div style={{padding: '20px', color: 'red'}}>❌ {error}</div>;
    
    return (
        <>
            <style>
                {`
                    .fade-in { animation: fadeIn 1s ease-in; }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                `}
            </style>
            <div className="fade-in" style={{ padding: '40px 20px', background: 'linear-gradient(180deg, #f7f3eb 0%, #efe7d8 100%)', minHeight: '100vh' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Imagen de potes - Hero Section */}
                    <div style={{ 
                        position: 'relative',
                        width: '100%', 
                        height: '280px',
                        marginBottom: '40px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }}>
                        {/* Imagen */}
                        <img 
                            src={`${API_URL}/images/newPotes.jpg`}
                            alt="Potes de hierbas" 
                            style={{ 
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center center',
                                filter: 'brightness(0.85) contrast(1.0) saturate(1.0)'
                            }}
                            onError={(e) => {
                              console.error('Error loading newPotes.jpg');
                              e.target.style.display = 'none';
                            }}
                        />
                        {/* Overlay gradiente */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(62,44,30,0.3) 0%, rgba(107,143,113,0.2) 100%)',
                            pointerEvents: 'none'
                        }} />
                    </div>
                    
                    <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h1 style={{ 
                            color: '#3f4f36', 
                            fontWeight: '700', 
                            fontSize: '3.5em',
                            letterSpacing: '2px',
                            textTransform: 'none',
                            margin: '0 0 10px 0'
                        }}>
                            Productos
                        </h1>
                        <p style={{ 
                            color: '#8c6a3f', 
                            fontSize: '1.4em', 
                            fontStyle: 'italic',
                            fontWeight: '300'
                        }}>
                            Selección de productos de elaboración propia
                        </p>
                    </header>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        {products.map((product) => (
                            <div key={product.id} style={{ 
                                background: 'white',
                                borderRadius: '15px', 
                                overflow: 'hidden',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                            }}
                            >
                                {/* IMAGEN - con botón + en esquina inferior derecha */}
                                <div 
                                    style={{ 
                                        position: 'relative',
                                        width: '100%',
                                        height: '150px',
                                        background: '#f0f0f0',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <img 
                                        src={product.imgUrl || `https://picsum.photos/seed/${product.id}/200/150`} 
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = `https://picsum.photos/seed/${product.id}/200/150`;
                                        }}
                                    />
                                    
                                    {/* Botón + en esquina inferior derecha */}
                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        style={{
                                            position: 'absolute',
                                            bottom: '12px',
                                            right: '12px',
                                            width: '45px',
                                            height: '45px',
                                            borderRadius: '50%',
                                            background: '#b08a5a',
                                            color: 'white',
                                            border: 'none',
                                            fontSize: '2em',
                                            fontWeight: '300',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(176, 138, 90, 0.35)',
                                            transition: 'all 0.3s ease',
                                            padding: '0'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#8c6a3f';
                                            e.target.style.boxShadow = '0 6px 16px rgba(140, 106, 63, 0.5)';
                                            e.target.style.transform = 'scale(1.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = '#b08a5a';
                                            e.target.style.boxShadow = '0 4px 12px rgba(176, 138, 90, 0.35)';
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1em', fontWeight: '600', color: '#333' }}>
                                        {product.name}
                                    </h3>
                                    <p style={{ color: '#888', fontSize: '0.85em', flexGrow: 1, margin: '6px 0', lineHeight: '1.4' }}>
                                        {product.description}
                                    </p>
                                    
                                    <div style={{ marginTop: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <div>
                                                {/* Precio base */}
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                                    <span style={{ fontSize: '1.5em', fontWeight: '700', color: '#6b8f71' }}>
                                                        €{Number(product.basePrice).toFixed(2)}
                                                    </span>
                                                </div>
                                                
                                                {/* Precio actual con descuento (solo si tiene nivel >= 1) */}
                                                {getDiscountForLevel(product) > 0 && (
                                                    <div style={{ fontSize: '0.85em', color: '#28a745', fontWeight: 'bold', marginTop: '3px' }}>
                                                        Tu precio: €{getPriceWithDiscount(product.basePrice, getDiscountForLevel(product)).toFixed(2)}
                                                        <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '4px' }}>
                                                            (-{getDiscountForLevel(product)}%)
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                {/* Vista previa del próximo nivel */}
                                                {getNextDiscount(product) !== null && getNextDiscount(product) > 0 && (
                                                    <div style={{ 
                                                        fontSize: '0.8em', 
                                                        color: '#999', 
                                                        marginTop: '3px'
                                                    }}>
                                                        {getNextLevelName()}: €{getPriceWithDiscount(product.basePrice, getNextDiscount(product)).toFixed(2)}
                                                        <span style={{ fontSize: '0.9em', marginLeft: '4px' }}>
                                                            (-{getNextDiscount(product)}%)
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <span style={{ 
                                                fontSize: '0.75em', 
                                                padding: '4px 8px', 
                                                background: product.stockQuantity > 0 ? '#e8f0e4' : '#f3e7dd', 
                                                color: product.stockQuantity > 0 ? '#3f5a3d' : '#8a5a44', 
                                                borderRadius: '15px',
                                                fontWeight: '600'
                                            }}>
                                                {product.stockQuantity > 0 ? `📦 ${product.stockQuantity}` : '❌ Sin stock'}
                                            </span>
                                        </div>

                                        {product.stockQuantity > 0 && (
                                            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', alignItems: 'center', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleQuantityChange(product.id, -1)}
                                                    disabled={quantities[product.id] <= 1}
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        padding: '0',
                                                        background: quantities[product.id] <= 1 ? '#e0e0e0' : '#f5f5f5',
                                                        color: quantities[product.id] <= 1 ? '#999' : '#333',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '5px',
                                                        cursor: quantities[product.id] <= 1 ? 'not-allowed' : 'pointer',
                                                        fontWeight: '600',
                                                        fontSize: '1em',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!e.target.disabled) {
                                                            e.target.style.background = '#6b8f71';
                                                            e.target.style.color = 'white';
                                                            e.target.style.borderColor = '#6b8f71';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = '#f5f5f5';
                                                        e.target.style.color = '#333';
                                                        e.target.style.borderColor = '#ddd';
                                                    }}
                                                >
                                                    −
                                                </button>
                                                <span style={{ width: '30px', textAlign: 'center', fontWeight: '700', fontSize: '1em', color: '#6b8f71' }}>
                                                    {quantities[product.id] || 1}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(product.id, 1)}
                                                    disabled={quantities[product.id] >= product.stockQuantity}
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        padding: '0',
                                                        background: quantities[product.id] >= product.stockQuantity ? '#e0e0e0' : '#f5f5f5',
                                                        color: quantities[product.id] >= product.stockQuantity ? '#999' : '#333',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '5px',
                                                        cursor: quantities[product.id] >= product.stockQuantity ? 'not-allowed' : 'pointer',
                                                        fontWeight: '600',
                                                        fontSize: '1em',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!e.target.disabled) {
                                                            e.target.style.background = '#6b8f71';
                                                            e.target.style.color = 'white';
                                                            e.target.style.borderColor = '#6b8f71';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = '#f5f5f5';
                                                        e.target.style.color = '#333';
                                                        e.target.style.borderColor = '#ddd';
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}

                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            disabled={!product.stockQuantity || product.stockQuantity <= 0}
                                            style={{ 
                                                width: '100%', 
                                                padding: '8px', 
                                                background: (!product.stockQuantity || product.stockQuantity <= 0) ? '#e0e0e0' : 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)', 
                                                color: (!product.stockQuantity || product.stockQuantity <= 0) ? '#999' : 'white', 
                                                border: 'none', 
                                                borderRadius: '6px',
                                                cursor: (!product.stockQuantity || product.stockQuantity <= 0) ? 'not-allowed' : 'pointer',
                                                fontWeight: '600',
                                                fontSize: '0.85em',
                                                transition: 'all 0.3s',
                                                letterSpacing: '0.5px'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!e.target.disabled) {
                                                    e.target.style.boxShadow = '0 6px 16px rgba(107, 143, 113, 0.35)';
                                                    e.target.style.transform = 'translateY(-2px)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.boxShadow = 'none';
                                                e.target.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            {(!product.stockQuantity || product.stockQuantity <= 0) ? '❌ Sin stock' : `🛒 Añadir (${quantities[product.id] || 1})`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MODAL PROFESIONAL */}
            {selectedProduct && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        maxWidth: '700px',
                        width: '95%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        position: 'relative'
                    }}>
                        {/* Botón cerrar */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'rgba(255,255,255,0.9)',
                                color: '#8c6a3f',
                                border: '2px solid #8c6a3f',
                                borderRadius: '50%',
                                width: '44px',
                                height: '44px',
                                cursor: 'pointer',
                                fontSize: '1.5em',
                                fontWeight: '300',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                zIndex: 10
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#8c6a3f';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.9)';
                                e.target.style.color = '#8c6a3f';
                            }}
                        >
                            ✕
                        </button>

                        {/* Imagen grande */}
                        <img 
                            src={selectedProduct.imgUrl || `https://picsum.photos/seed/${selectedProduct.id}/700/400`}
                            alt={selectedProduct.name}
                            style={{
                                width: '100%',
                                maxHeight: '350px',
                                objectFit: 'cover',
                                borderRadius: '20px 20px 0 0'
                            }}
                        />

                        <div style={{ padding: '35px' }}>
                            {/* Nombre y precio */}
                            <h2 style={{ margin: '0 0 15px 0', fontSize: '2em', fontWeight: '700', color: '#333' }}>
                                {selectedProduct.name}
                            </h2>
                            
                            <div style={{ display: 'flex', gap: '25px', marginBottom: '25px', alignItems: 'center', borderBottom: '2px solid #f0f0f0', paddingBottom: '20px' }}>
                                <span style={{ fontSize: '2.2em', fontWeight: '700', color: '#6b8f71' }}>
                                    €{Number(selectedProduct.basePrice).toFixed(2)}
                                </span>
                                <span style={{ 
                                    fontSize: '1em', 
                                    padding: '10px 18px', 
                                    background: selectedProduct.stockQuantity > 0 ? '#e8f0e4' : '#f3e7dd', 
                                    color: selectedProduct.stockQuantity > 0 ? '#3f5a3d' : '#8a5a44', 
                                    borderRadius: '25px',
                                    fontWeight: '700'
                                }}>
                                    {selectedProduct.stockQuantity > 0 ? `📦 ${selectedProduct.stockQuantity} disponibles` : '❌ Sin stock'}
                                </span>
                            </div>

                            {/* Descripción */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ marginTop: 0, fontSize: '1.1em', fontWeight: '600', color: '#6b8f71', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Descripción
                                </h3>
                                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '1em', margin: '8px 0 0 0' }}>
                                    {selectedProduct.description}
                                </p>
                            </div>

                            {/* Ingredientes */}
                            {selectedProduct.ingredients && (
                                <div style={{ marginBottom: '25px', padding: '15px', background: '#f5f2ea', borderRadius: '10px', borderLeft: '4px solid #6b8f71' }}>
                                    <h3 style={{ marginTop: 0, fontSize: '1.1em', fontWeight: '600', color: '#6b8f71', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        📋 Ingredientes
                                    </h3>
                                    <p style={{ color: '#666', whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '0.95em', margin: '8px 0 0 0' }}>
                                        {selectedProduct.ingredients}
                                    </p>
                                </div>
                            )}

                            {/* Instrucciones */}
                            {selectedProduct.usageInstructions && (
                                <div style={{ marginBottom: '25px', padding: '15px', background: '#f5f2ea', borderRadius: '10px', borderLeft: '4px solid #8c6a3f' }}>
                                    <h3 style={{ marginTop: 0, fontSize: '1.1em', fontWeight: '600', color: '#8c6a3f', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        📝 Modo de uso
                                    </h3>
                                    <p style={{ color: '#666', whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '0.95em', margin: '8px 0 0 0' }}>
                                        {selectedProduct.usageInstructions}
                                    </p>
                                </div>
                            )}

                            {/* Controles de cantidad y botón */}
                            {selectedProduct.stockQuantity > 0 && (
                                <div style={{ marginTop: '30px', paddingTop: '25px', borderTop: '2px solid #f0f0f0' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                                        <span style={{ fontSize: '0.95em', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Cantidad:
                                        </span>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <button
                                                onClick={() => handleQuantityChange(selectedProduct.id, -1)}
                                                disabled={quantities[selectedProduct.id] <= 1}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    padding: '0',
                                                    background: quantities[selectedProduct.id] <= 1 ? '#e0e0e0' : '#f5f5f5',
                                                    color: quantities[selectedProduct.id] <= 1 ? '#999' : '#333',
                                                    border: '2px solid #ddd',
                                                    borderRadius: '8px',
                                                    cursor: quantities[selectedProduct.id] <= 1 ? 'not-allowed' : 'pointer',
                                                    fontWeight: '700',
                                                    fontSize: '1.2em',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!e.target.disabled) {
                                                        e.target.style.background = '#6b8f71';
                                                        e.target.style.color = 'white';
                                                        e.target.style.borderColor = '#6b8f71';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = '#f5f5f5';
                                                    e.target.style.color = '#333';
                                                    e.target.style.borderColor = '#ddd';
                                                }}
                                            >
                                                −
                                            </button>
                                            <span style={{ width: '40px', textAlign: 'center', fontWeight: '700', fontSize: '1.2em', color: '#6b8f71' }}>
                                                {quantities[selectedProduct.id] || 1}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(selectedProduct.id, 1)}
                                                disabled={quantities[selectedProduct.id] >= selectedProduct.stockQuantity}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    padding: '0',
                                                    background: quantities[selectedProduct.id] >= selectedProduct.stockQuantity ? '#e0e0e0' : '#f5f5f5',
                                                    color: quantities[selectedProduct.id] >= selectedProduct.stockQuantity ? '#999' : '#333',
                                                    border: '2px solid #ddd',
                                                    borderRadius: '8px',
                                                    cursor: quantities[selectedProduct.id] >= selectedProduct.stockQuantity ? 'not-allowed' : 'pointer',
                                                    fontWeight: '700',
                                                    fontSize: '1.2em',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!e.target.disabled) {
                                                        e.target.style.background = '#6b8f71';
                                                        e.target.style.color = 'white';
                                                        e.target.style.borderColor = '#6b8f71';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = '#f5f5f5';
                                                    e.target.style.color = '#333';
                                                    e.target.style.borderColor = '#ddd';
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            handleAddToCart(selectedProduct);
                                            setSelectedProduct(null);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontSize: '1.1em',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            letterSpacing: '0.5px',
                                            boxShadow: '0 4px 12px rgba(107, 143, 113, 0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.boxShadow = '0 8px 20px rgba(107, 143, 113, 0.45)';
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.boxShadow = '0 4px 12px rgba(107, 143, 113, 0.3)';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        🛒 Agregar {quantities[selectedProduct.id] || 1} al carrito
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductList;