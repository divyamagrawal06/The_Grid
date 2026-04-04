import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Challenges from './pages/Challenges'
import Scoreboard from './pages/Scoreboard'
import GMPanel from './pages/GMPanel'
import Teams from './pages/Teams'
import Navbar from './components/Navbar'

function ProtectedRoute({ children, requiredRole }) {
  const { user, bootstrapping } = useAuth()

  if (bootstrapping) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: 'var(--accent)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/challenges" replace />
  }
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/challenges" element={
            <ProtectedRoute>
              <Challenges />
            </ProtectedRoute>
          } />
          <Route path="/scoreboard" element={
            <ProtectedRoute>
              <Scoreboard />
            </ProtectedRoute>
          } />
          <Route path="/teams" element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          } />
          <Route path="/gm" element={
            <ProtectedRoute requiredRole="gm">
              <GMPanel />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}