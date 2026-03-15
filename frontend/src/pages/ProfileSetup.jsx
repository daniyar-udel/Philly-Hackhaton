import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const ARTIST_CATEGORIES = [
  'Live Music', 'Food Influencer', 'Social Influencer',
  'Visual Art / Mural', 'Brand Design', 'Video / Film',
  'Live Painting', 'Creative Direction', 'DJ', 'Photographer', 'Other',
]

export default function ProfileSetup() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ bio: '', category: '', skills: '', location: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean)

    try {
      // 1. Save the artist profile
      const profileRes = await fetch(`/api/profiles/artist/${user.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: user.display_name,
          bio: form.bio,
          category: form.category,
          skills,
          location: form.location || null,
        }),
      })

      if (!profileRes.ok) {
        const d = await profileRes.json()
        setError(d.detail || 'Failed to save profile. Try again.')
        return
      }

      // 2. Trigger embedding (fire-and-forget — don't block on failure)
      try {
        await fetch(`/api/match/embed/artist/${user.user_id}`, { method: 'POST' })
      } catch {
        // Embedding failed — profile is still saved, matching won't work yet
      }

      navigate('/artist')
    } catch {
      setError('Could not reach the server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-green-900 px-6 py-10">
        <div className="max-w-xl mx-auto animate-fade-up">
          <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">One more step</p>
          <h1 className="text-3xl font-bold text-white">Build your creator profile</h1>
          <p className="text-green-200 mt-1 text-sm">
            This is what our AI reads to match you with the right gigs. More detail = better matches.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="card p-7 shadow-lg space-y-5 animate-scale-in">

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">What best describes you?</label>
            <select name="category" required value={form.category} onChange={handleChange} className="field cursor-pointer">
              <option value="">Pick your category</option>
              {ARTIST_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bio</label>
            <textarea
              name="bio" required rows={4} value={form.bio} onChange={handleChange}
              placeholder="Tell businesses who you are — your style, your energy, what you bring to a space..."
              className="field resize-none"
            />
            <p className="text-xs text-gray-400 mt-1.5">💡 The AI reads this to find your best-fit gigs.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Skills</label>
            <input
              name="skills" required value={form.skills} onChange={handleChange}
              placeholder="e.g. jazz piano, improvisation, live looping, R&B"
              className="field"
            />
            <p className="text-xs text-gray-400 mt-1.5">Separate with commas</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Neighborhood</label>
            <input
              name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. South Philly, Fishtown, West Philly"
              className="field"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="btn bg-green-600 hover:bg-green-700 text-white w-full py-3.5 rounded-xl disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Building your AI profile...
              </span>
            ) : 'Find My Gig Matches →'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/artist')}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  )
}
