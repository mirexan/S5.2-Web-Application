import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'

// Reemplaza con tu Google Client ID desde Google Cloud Console
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <CartProvider>
        <App />
      </CartProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
