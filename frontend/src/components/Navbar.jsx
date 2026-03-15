import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-green-900 shadow-lg animate-slide-down">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center text-green-900 font-black text-sm">
            GN
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Good <span className="text-green-400">Neighbors</span>
          </span>
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium">
          {user ? (
            <>
              <span className="text-green-300 text-sm hidden sm:block">{user.display_name}</span>
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest hidden sm:block">
                {user.role === 'business' ? '🏢 Business' : '🎨 Creator'}
              </span>
              <button
                onClick={handleLogout}
                className="btn bg-green-700 hover:bg-green-600 text-white px-5 py-2 text-sm rounded-full"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/business" className="text-green-200 hover:text-white transition-colors duration-200">
                For Businesses
              </Link>
              <Link to="/artist" className="text-green-200 hover:text-white transition-colors duration-200">
                For Creators
              </Link>
              <Link to="/login" className="btn bg-green-400 text-green-900 px-5 py-2 text-sm rounded-full">
                Sign In
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}
