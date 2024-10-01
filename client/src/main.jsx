import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import NavBar from './components/NavBar/NavBar.jsx'
import { AuthProvider } from './AuthContext';
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
  <React.StrictMode>
    
  <AuthProvider>
    <NavBar />
    <App />
  </AuthProvider>
  </React.StrictMode>,
  </>

)
