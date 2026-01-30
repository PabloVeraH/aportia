import 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Cargando...</div>

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function Dashboard() {
  const { signOut } = useAuth()
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold underline text-blue-600">
        Bienvenido a Aportia (React + Vite)
      </h1>
      <button onClick={signOut} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Cerrar Sesión
      </button>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
