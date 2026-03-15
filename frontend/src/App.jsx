import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import BusinessDashboard from './pages/BusinessDashboard'
import ArtistFeed from './pages/ArtistFeed'
import PostGig from './pages/PostGig'
import ProfileSetup from './pages/ProfileSetup'
import { AuthContext, useAuth, getStoredUser, storeUser, clearStoredUser } from './lib/auth'

function ProtectedRoute({ children, requiredRole }) {
  // Check localStorage directly as fallback — React state update from login()
  // may not have propagated yet when navigate() fires immediately after.
  const { user } = useAuth()
  const currentUser = user || getStoredUser()
  if (!currentUser) return <Navigate to="/login" replace />
  if (requiredRole && currentUser.role !== requiredRole) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const [user, setUser] = useState(() => getStoredUser())

  const login = (data) => {
    storeUser(data)
    setUser(data)
  }

  const logout = () => {
    clearStoredUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/setup"
                element={
                  <ProtectedRoute>
                    <ProfileSetup />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/business"
                element={
                  <ProtectedRoute requiredRole="business">
                    <BusinessDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/business/post-gig"
                element={
                  <ProtectedRoute requiredRole="business">
                    <PostGig />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/artist"
                element={
                  <ProtectedRoute requiredRole="artist">
                    <ArtistFeed />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/"
                element={
                  user
                    ? user.role === 'business'
                      ? <Navigate to="/business" replace />
                      : <Navigate to="/artist" replace />
                    : <Navigate to="/login" replace />
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
