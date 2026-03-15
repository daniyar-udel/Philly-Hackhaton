import { Link } from 'react-router-dom'

// TODO: wire up real auth state and logout
export default function Navbar() {
  return (
    <nav className="bg-green-900 shadow-lg animate-slide-down">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center text-green-900 font-black text-sm">
            EYN
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Expand Your <span className="text-green-400">Neighborhood</span>
          </span>
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium">
          <Link to="/business" className="text-green-200 hover:text-white transition-colors duration-200">
            For Businesses
          </Link>
          <Link to="/artist" className="text-green-200 hover:text-white transition-colors duration-200">
            For Creators
          </Link>
          <Link to="/login" className="btn bg-green-400 text-green-900 px-5 py-2 text-sm">
            Sign In
          </Link>
        </div>

      </div>
    </nav>
  )
}
