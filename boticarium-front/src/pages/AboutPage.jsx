function AboutPage() {
  const imageUrl = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop';

  return (
    <div style={{
      background: 'linear-gradient(180deg, #f7f3eb 0%, #efe7d8 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#3f4f36', textAlign: 'center', marginBottom: '30px', fontWeight: '300', letterSpacing: '1px' }}>
          🌿 Quiénes somos
        </h1>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          marginBottom: '24px'
        }}>
          <img
            src={imageUrl}
            alt="Boticarium"
            style={{ width: '100%', maxHeight: '360px', objectFit: 'cover', borderRadius: '12px' }}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop'; }}
          />
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          marginBottom: '24px'
        }}>
          <h2 style={{ color: '#6b8f71', marginTop: 0 }}>Nuestra historia</h2>
          <p style={{ color: '#5a4a3c', lineHeight: '1.8' }}>
            Boticarium nace del amor por la herbolaria tradicional y el cuidado natural.
            Seleccionamos ingredientes de origen responsable y trabajamos con fórmulas inspiradas en
            la tradición mediterránea y asiática, buscando equilibrio, bienestar y sostenibilidad.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '22px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ color: '#8c6a3f', marginTop: 0 }}>🍃 Misión</h3>
            <p style={{ color: '#5a4a3c', lineHeight: '1.7' }}>
              Ofrecer productos naturales de alta calidad para el cuidado diario, con transparencia y ética.
            </p>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '22px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ color: '#8c6a3f', marginTop: 0 }}>🌱 Valores</h3>
            <ul style={{ color: '#5a4a3c', lineHeight: '1.7', paddingLeft: '18px' }}>
              <li>Ingredientes responsables</li>
              <li>Respeto por la tradición</li>
              <li>Bienestar y equilibrio</li>
              <li>Transparencia y calidad</li>
            </ul>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '22px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ color: '#8c6a3f', marginTop: 0 }}>🧪 Selección botánica</h3>
            <p style={{ color: '#5a4a3c', lineHeight: '1.7' }}>
              Curamos cada mezcla priorizando plantas con tradición de uso y evidencia de efectividad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;


