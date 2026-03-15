import { Link } from 'react-router-dom'

// TODO: wire up real auth state and logout
export default function Navbar() {
  return (
    <nav className="bg-philly-dark border-b border-philly-green/40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-philly-neon font-bold text-xl tracking-tight">LocalStage</span>
          <span className="hidden sm:block text-philly-muted text-xs uppercase tracking-widest border border-philly-green/40 px-2 py-0.5 rounded-full">
            Philadelphia
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/business" className="text-philly-muted hover:text-philly-neon transition-colors">
            For Businesses
          </Link>
          <Link to="/artist" className="text-philly-muted hover:text-philly-neon transition-colors">
            For Creators
          </Link>
          <Link
            to="/login"
            className="bg-philly-neon text-philly-black font-bold px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  )
}
