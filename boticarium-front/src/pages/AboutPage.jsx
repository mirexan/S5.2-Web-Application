import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// --- COMPONENTE DE ACORDEÓN EDITORIAL ---
// Sin cajas, sin fondos, solo tipografía y líneas sutiles.
const EditorialAccordion = ({ title, isOpen, onClick, children }) => {
  return (
    <div style={{ marginBottom: '0px' }}>
      <button
        onClick={onClick}
        style={{
          width: '100%',
          padding: '25px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid rgba(140, 106, 63, 0.3)', // Línea dorada sutil
          cursor: 'pointer',
          textAlign: 'left',
          outline: 'none'
        }}
      >
        <span style={{ 
          fontSize: '2em', 
          color: '#3f4f36', // Verde Boticarium
          fontWeight: '400',
          fontFamily: "'Averia Serif Libre', serif",
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {title}
        </span>
        <span style={{ 
          fontSize: '1.5em', 
          color: '#8c6a3f', // Dorado
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', // Animación de cruz a equis
          fontWeight: '300'
        }}>
          +
        </span>
      </button>
      
      <div style={{
        maxHeight: isOpen ? '1000px' : '0',
        opacity: isOpen ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.5s ease-in-out',
        paddingBottom: isOpen ? '40px' : '0' // Aire al final si está abierto
      }}>
        <div style={{ paddingTop: '30px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

function AboutPage() {
  const imageUrl = `${API_URL}/images/herbologie.png`;

  // Estado para controlar qué sección está abierta
  const [openSection, setOpenSection] = useState(null); // Empezamos con todo cerrado (solo títulos)

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const colors = {
    bgGradient: 'linear-gradient(180deg, #f7f3eb 0%, #efe7d8 100%)',
    textMain: '#5a4a3c',
    greenDark: '#3f4f36',
    goldAccent: '#8c6a3f'
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Averia+Serif+Libre:wght@300;400;700&display=swap');
          .averia-font { font-family: 'Averia Serif Libre', serif; }
          
          .editorial-text { 
            font-size: 1.2em; 
            line-height: 1.8; 
            text-align: justify; 
            color: #5a4a3c;
          }

          /* Letra capital para el inicio de párrafos importantes */
          .drop-cap {
            float: left;
            font-size: 3.8em;
            line-height: 0.8;
            padding-top: 4px;
            padding-right: 8px;
            color: #3f4f36;
            font-weight: 700;
          }
          
          .fade-in { animation: fadeIn 1s ease-in; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}
      </style>

      <div className="averia-font fade-in" style={{
        background: colors.bgGradient,
        minHeight: '100vh',
        padding: '60px 20px',
        color: colors.textMain
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Imagen barra.jpg - Header visual */}
          <div style={{ 
            position: 'relative',
            width: '100%', 
            height: '280px',
            marginBottom: '40px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}>
            <img 
              src={`${API_URL}/images/barra.jpg`}
              alt="Boticarium - Quiénes somos" 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                filter: 'brightness(0.85) contrast(1.0) saturate(1.0)'
              }}
              onError={(e) => {
                console.error('Error loading barra.jpg');
                e.target.style.display = 'none';
              }}
            />
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
          
          {/* --- ENCABEZADO --- */}
          <header style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ 
              color: colors.greenDark, 
              fontWeight: '700', 
              fontSize: '3.5em',
              letterSpacing: '2px',
              textTransform: 'none',
              margin: '0 0 10px 0'
            }}>
              Boticarium
            </h1>
            <p style={{ 
              color: colors.goldAccent, 
              fontSize: '1.4em', 
              fontStyle: 'italic',
              fontWeight: '300'
            }}>
              Recuperando el origen farmacológico con rigor científico
            </p>
          </header>

          {/* --- IMAGEN --- */}
          <div style={{ marginBottom: '80px', textAlign: 'center' }}>
            <img
              src={imageUrl}
              alt="Laboratorio Boticarium"
              style={{ 
                maxWidth: '100%',
                height: 'auto',
                display: 'inline-block'
              }}
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <div style={{ 
              marginTop: '20px', 
              textAlign: 'center', 
              fontSize: '0.9em',
              borderTop: '1px solid rgba(90, 74, 60, 0.2)',
              paddingTop: '15px',
              width: '60%',
              margin: '20px auto 0 auto'
            }}>
              <span style={{ color: colors.goldAccent, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', marginRight: '10px' }}>
                Comunicado
              </span>
              Herbologie evoluciona. <strong>Boticarium</strong> es el nuevo nombre de nuestra esencia.
            </div>
          </div>

          {/* --- SECCIONES DESPLEGABLES (EDITORIAL STYLE) --- */}
          <div style={{ marginBottom: '80px' }}>
            
            {/* 1. EL ORIGEN */}
            <EditorialAccordion 
              title="I. El Origen" 
              isOpen={openSection === 'origen'} 
              onClick={() => toggleSection('origen')}
            >
              <div className="editorial-text">
                <p style={{ marginBottom: '20px' }}>
                  <span className="drop-cap">B</span>oticarium es la unión de dos trayectorias complementarias: la de <strong>dos hermanos</strong> que crecieron familiarizados con el uso cotidiano de remedios botánicos. Esa convivencia cercana con las plantas despertó en nosotros una curiosidad que fue más allá de la tradición: queríamos entender el <em>mecanismo</em> detrás del efecto.
                </p>
                <p style={{ marginBottom: '20px' }}>
                  Esa inquietud nos impulsó a buscar el rigor académico. Nos formamos en <strong>Bioquímica</strong> en la universidad y cursamos el grado superior en <strong>Dietética y Nutrición en el instituto Roger de Llúria</strong>.
                </p>
                <p style={{ fontWeight: '700', color: colors.greenDark }}>
                  Hoy unimos conocimiento molecular y sabiduría tradicional para dotar a la droga vegetal de una base científica sólida y rigurosa, recuperando su origen farmacológico sin misticismos.
                </p>
              </div>
            </EditorialAccordion>

            {/* 2. EL CRITERIO */}
            <EditorialAccordion 
              title="II. El Criterio Boticarium" 
              isOpen={openSection === 'criterio'} 
              onClick={() => toggleSection('criterio')}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                
                {/* Columna A */}
                <div>
                  <h4 style={{ color: colors.goldAccent, fontSize: '1.2em', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>
                    Evidencia vs. Mito
                  </h4>
                  <p className="editorial-text" style={{ fontSize: '1.1em' }}>
                    Separamos el grano de la paja. Contrastamos artículos científicos para validar cada producto. Mantenemos una <strong>independencia total</strong> respecto a las marcas; nuestra única lealtad es con la eficacia demostrada.
                  </p>
                </div>

                {/* Columna B */}
                <div>
                  <h4 style={{ color: colors.goldAccent, fontSize: '1.2em', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>
                    Pureza y Contexto
                  </h4>
                  <p className="editorial-text" style={{ fontSize: '1.1em' }}>
                    <strong>Sin tóxicos, sin excusas.</strong> Buscamos el mínimo de aditivos sintéticos. Priorizamos lo libre de parabenos y tóxicos, complementando siempre el producto con consejos sobre hábitos e higiene de vida.
                  </p>
                </div>

              </div>
            </EditorialAccordion>

          </div>

          {/* --- FOOTER: PILARES (LIMPIO SIN LÍNEAS) --- */}
          <section style={{ 
            background: colors.greenDark, 
            color: '#f7f3eb', 
            padding: '60px 40px',
            marginTop: '60px'
          }}>
            <h2 style={{ 
              color: '#d4c5a9', 
              fontSize: '2em', 
              textAlign: 'center',
              marginBottom: '50px',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              fontWeight: '300'
            }}>
              Nuestros Pilares
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '50px',
              textAlign: 'left'
            }}>
              
              {/* Pilar 1 */}
              <div>
                <h4 style={{ color: '#d4c5a9', fontSize: '1.3em', marginBottom: '15px', fontFamily: "'Averia Serif Libre', serif" }}>
                  Visión Holística
                </h4>
                <p style={{ lineHeight: '1.6', opacity: 0.85, fontSize: '1.05em' }}>
                  No tratamos síntomas aislados; entendemos el cuerpo como un sistema interconectado donde la nutrición y la bioquímica dialogan constantemente.
                </p>
              </div>

              {/* Pilar 2 */}
              <div>
                <h4 style={{ color: '#d4c5a9', fontSize: '1.3em', marginBottom: '15px', fontFamily: "'Averia Serif Libre', serif" }}>
                  Humildad Intelectual
                </h4>
                <p style={{ lineHeight: '1.6', opacity: 0.85, fontSize: '1.05em' }}>
                  Reconocemos lo que no sabemos y buscamos respuestas. La mejora continua no es una opción, es nuestra obligación profesional.
                </p>
              </div>

              {/* Pilar 3 */}
              <div>
                <h4 style={{ color: '#d4c5a9', fontSize: '1.3em', marginBottom: '15px', fontFamily: "'Averia Serif Libre', serif" }}>
                  Mirada Clínica
                </h4>
                <p style={{ lineHeight: '1.6', opacity: 0.85, fontSize: '1.05em' }}>
                  Nos diferencia nuestra curiosidad. La formación constante refina nuestra capacidad de atención personalizada cada día.
                </p>
              </div>

            </div>
          </section>

        </div>
      </div>
    </>
  );
}

export default AboutPage;