import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/products" element={<h2>Catálogo de Productos (Próximamente)</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;