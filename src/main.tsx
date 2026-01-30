import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { CenterProvider } from './context/CenterContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CenterProvider>
        <App />
      </CenterProvider>
    </AuthProvider>
  </React.StrictMode>,
)
