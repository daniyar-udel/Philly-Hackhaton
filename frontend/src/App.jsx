import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import BusinessDashboard from './pages/BusinessDashboard'
import ArtistFeed from './pages/ArtistFeed'
import PostGig from './pages/PostGig'

// DEMO MODE — swap role to 'artist' or 'business' to preview that view
// TODO: replace with real Supabase auth session
const DEMO_ROLE = 'business' // 👈 change to 'artist' to see Artist Feed
const useAuth = () => ({ user: DEMO_ROLE ? { id: 'demo' } : null, role: DEMO_ROLE })

function ProtectedRoute({ children, requiredRole }) {
  const { user, role } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { user, role } = useAuth()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />

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

            {/* Default redirect based on role */}
            <Route
              path="/"
              element={
                user
                  ? role === 'business'
                    ? <Navigate to="/business" replace />
                    : <Navigate to="/artist" replace />
                  : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
