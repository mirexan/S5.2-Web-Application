import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function ImageGalleryModal({ isOpen, onClose, onSelectImage }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/uploads/images`);
      setImages(response.data.images || []);
    } catch (err) {
      setError('Error al cargar las imágenes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (imageUrl) => {
    onSelectImage(imageUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '800px',
        maxHeight: '80vh',
        width: '90%',
        overflow: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>🖼️ Galería de Imágenes de Cloudinary</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ✕
          </button>
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#666' }}>⏳ Cargando imágenes...</p>}
        
        {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

        {!loading && !error && images.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>
            No hay imágenes disponibles. Sube una imagen primero.
          </p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '15px',
          marginTop: '20px'
        }}>
          {images.map((imageUrl, index) => (
            <div
              key={index}
              onClick={() => handleSelectImage(imageUrl)}
              style={{
                cursor: 'pointer',
                border: '2px solid transparent',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.2s',
                ':hover': {
                  borderColor: '#6b8f71',
                  transform: 'scale(1.05)'
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6b8f71';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src={imageUrl}
                alt={`Imagen ${index + 1}`}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#e0e0e0',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageGalleryModal;
