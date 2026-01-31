import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MainLayout from './layouts/MainLayout'
import NewDonation from './pages/Donations/New'
import ProductList from './pages/Products/Index'
import ProductFormPage from './pages/Products/FormPage'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Cargando...</div>

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}



function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout>
                <Outlet />
              </MainLayout>
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/donations/new" element={<NewDonation />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
