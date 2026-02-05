import { useEffect, useState } from 'react';
import { isAdmin } from '../utils/jwtUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const DEFAULT_CONTACT = {
  name: 'Boticarium',
  address: 'Calle de la Herboristería, 12',
  city: '28000 Madrid, España',
  phone: '+34 600 000 000',
  email: 'contacto@boticarium.com',
  hours: 'Lunes a Sábado: 10:00 - 20:00\nDomingo: Cerrado',
  whatsapp: '34600000000',
  mapQuery: 'Puerta del Sol Madrid'
};

function ContactPage() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const adminRole = isAdmin();
  const [contact, setContact] = useState(DEFAULT_CONTACT);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('contactInfo');
    if (saved) {
      setContact(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('contactInfo', JSON.stringify(contact));
    setEditing(false);
  };

  const whatsappMessage = encodeURIComponent('Hola Boticarium, quisiera más información sobre sus productos.');
  const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${whatsappMessage}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`;

  return (
    <>
      <style>
        {`
          .fade-in { animation: fadeIn 1s ease-in; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}
      </style>
      <div className="fade-in" style={{
        background: 'linear-gradient(180deg, #f7f3eb 0%, #efe7d8 100%)',
        minHeight: '100vh',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Imagen contacto.jpg - Hero Section */}
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
            src={`${API_URL}/images/contacto.jpg`}
            alt="Contacto Boticarium" 
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center bottom',
              filter: 'brightness(0.75) contrast(1.1) saturate(1.2)'
            }}
            onError={(e) => e.target.style.display = 'none'}
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
            Contacto
          </h1>
        </header>

        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Tarjeta de Contacto */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start'
          }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ color: '#6b8f71', marginTop: 0 }}>
                {contact.name}
              </h2>
              <p style={{ color: '#5a4a3c', lineHeight: '1.7' }}>
                {contact.address}<br />
                {contact.city}
              </p>
              <p style={{ color: '#5a4a3c', lineHeight: '1.7' }}>
                📞 {contact.phone || <span style={{ fontStyle: 'italic', color: '#8c6a3f' }}>(recomendable)</span>}<br />
                ✉️ {contact.email}
              </p>
              <p style={{ color: '#5a4a3c', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                🕒 {contact.hours}
              </p>
              {isLoggedIn ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'block',
                    background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(107, 143, 113, 0.35)',
                    marginTop: '24px',
                    marginBottom: '12px',
                    width: '188px',
                    textAlign: 'center'
                  }}
                >
                  💬 Escribir por WhatsApp
                </a>
              ) : (
                <div style={{
                  background: '#f5f2ea',
                  color: '#8a5a44',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #e1d3bf',
                  fontWeight: '600',
                  marginTop: '12px'
                }}>
                  Inicia sesión para contactar por WhatsApp.
                </div>
              )}
              
              {/* Botón Editar - MOVIDO AQUÍ */}
              {adminRole && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #b08a5a 0%, #9a764b 100%)',
                    color: 'white',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginTop: 0,
                    marginBottom: 0,
                    display: 'block',
                    fontSize: '0.95em',
                    width: '188px',
                    textAlign: 'center'
                  }}
                >
                  ✏️ Editar contacto
                </button>
              )}
            </div>
            <img 
              src="/logo.png" 
              alt="Boticarium Logo" 
              style={{ width: '150px', height: '150px', objectFit: 'contain', flexShrink: 0, marginLeft: '-10px' }}
            />
          </div>

          {/* Formulario de Edición - Aparece cuando se activa */}
          {adminRole && editing && (
            <div style={{ 
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
              gridColumn: '1 / -1'
            }}>
              <h3 style={{ color: '#6b8f71', marginTop: 0 }}>✏️ Editar Contacto</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  placeholder="Nombre"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e1d3bf' }}
                />
                <input
                  type="text"
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  placeholder="Dirección"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e1d3bf' }}
                />
                <input
                  type="text"
                  value={contact.city}
                  onChange={(e) => setContact({ ...contact, city: e.target.value })}
                  placeholder="Ciudad"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e1d3bf' }}
                />
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder="Teléfono (recomendable)"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e1d3bf' }}
                />
                <input
                  type="text"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  placeholder="Email"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e1d3bf' }}
                />
                <textarea
                  value={contact.hours}
                  onChange={(e) => setContact({ ...contact, hours: e.target.value })}
                  placeholder="Horario"
                  rows="3"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e1d3bf' }}
                />
                <input
                  type="text"
                  value={contact.whatsapp}
                  onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                  placeholder="WhatsApp (solo números)"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e1d3bf' }}
                />
                <input
                  type="text"
                  value={contact.mapQuery}
                  onChange={(e) => setContact({ ...contact, mapQuery: e.target.value })}
                  placeholder="Ubicación del mapa (dirección o lugar)"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e1d3bf' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleSave}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #7a9b76 0%, #6b8f71 100%)',
                      color: 'white',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d8c7ae',
                      background: '#f5f2ea',
                      color: '#5a4a3c',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tarjeta Mapa */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '12px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
          }}>
            <iframe
              title="Mapa Boticarium"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2991.7264247303606!2d2.152879774507128!3d41.423456993759416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4bd4d776636db%3A0x5aeb75dfbd17165!2sHerbologie!5e0!3m2!1ses!2ses!4v1770033974572!5m2!1ses!2ses"
              style={{ width: '100%', height: '360px', border: '0', borderRadius: '12px' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default ContactPage;
