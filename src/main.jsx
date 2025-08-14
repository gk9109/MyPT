import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/globals.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthProvider } from './firebase/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
