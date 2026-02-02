import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage';
import AdminPanel from './pages/AdminPanel';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import SubNavbar from './components/SubNavbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <SubNavbar />
      <Routes>

        <Route path="/" element={<Navigate to="/products" />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/products" element={<ProductList />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;