import { useState } from 'react'

// TODO: integrate Supabase Auth — supabase.auth.signInWithPassword / signUp
// TODO: after login, read user metadata to determine role, redirect accordingly
export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [role, setRole] = useState('artist') // 'artist' | 'business'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: call Supabase auth
    console.log({ mode, role, email, password })
  }

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4">

      {/* Hero text */}
      <div className="text-center mb-10">
        <p className="text-philly-neon text-sm font-semibold uppercase tracking-widest mb-3">
          Philadelphia's Creator Marketplace
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold text-philly-text leading-tight">
          Expand Your<br />
          <span className="text-philly-neon">Neighborhood.</span>
        </h1>
        <p className="text-philly-muted mt-4 text-base max-w-sm mx-auto">
          Connecting local creators with Philly businesses — matched by vibe, not keywords.
        </p>
      </div>

      {/* Form card */}
      <div className="w-full max-w-sm bg-philly-card border border-philly-green/30 rounded-2xl p-7">

        {/* Mode toggle */}
        <div className="flex bg-philly-dark rounded-xl p-1 mb-6">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                mode === m
                  ? 'bg-philly-neon text-philly-black'
                  : 'text-philly-muted hover:text-philly-text'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector — only on signup */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-philly-muted uppercase tracking-wider mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'artist', label: 'Creator', emoji: '🎨' },
                  { value: 'business', label: 'Business', emoji: '🏢' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                      role === r.value
                        ? 'border-philly-neon bg-philly-neon/10 text-philly-neon'
                        : 'border-philly-green/30 text-philly-muted hover:border-philly-neon/50'
                    }`}
                  >
                    <span className="block text-lg mb-0.5">{r.emoji}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-philly-muted uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-philly-black border border-philly-green/30 rounded-xl px-4 py-3 text-sm text-philly-text placeholder-philly-muted focus:outline-none focus:border-philly-neon transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-philly-muted uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-philly-black border border-philly-green/30 rounded-xl px-4 py-3 text-sm text-philly-text placeholder-philly-muted focus:outline-none focus:border-philly-neon transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-philly-neon hover:opacity-90 text-philly-black font-bold py-3 rounded-xl transition-opacity mt-2"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-philly-muted mt-5">
          {mode === 'login' ? "New to LocalStage? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-philly-neon font-semibold hover:underline"
          >
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
