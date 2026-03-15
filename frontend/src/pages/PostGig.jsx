import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  'Live Music',
  'Food Influencer',
  'Social Influencer',
  'Mural / Visual Art',
  'Brand Design',
  'Video / Film',
  'Live Painting',
  'Creative Direction',
  'DJ',
  'Other',
]

// TODO: POST /gigs with form data
// TODO: after posting, trigger embedding generation on the backend
export default function PostGig() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    pay: '',
    date: '',
    location: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: POST to /api/gigs and handle response
    console.log('Posting gig:', form)
    navigate('/business')
  }

  const inputClass = `w-full bg-philly-black border border-philly-green/30 rounded-xl px-4 py-3 text-sm text-philly-text placeholder-philly-muted focus:outline-none focus:border-philly-neon transition-colors`

  return (
    <div className="max-w-xl mx-auto px-4 py-8">

      {/* Header */}
      <p className="text-philly-neon text-xs font-semibold uppercase tracking-widest mb-1">New Opportunity</p>
      <h1 className="text-3xl font-bold text-philly-text mb-1">Post a Gig</h1>
      <p className="text-philly-muted text-sm mb-8">
        Describe what you need — our AI matches you with the right Philly creator.
      </p>

      <form onSubmit={handleSubmit} className="bg-philly-card border border-philly-green/20 rounded-2xl p-6 space-y-5">

        <div>
          <label className="block text-xs font-semibold text-philly-muted uppercase tracking-wider mb-2">
            Gig Title
          </label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Live music for our grand opening"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-philly-muted uppercase tracking-wider mb-2">
            Category
          </label>
          <select
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="" className="bg-philly-dark">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} className="bg-philly-dark">{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-philly-muted uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            name="description"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the vibe, venue, audience, what you're really looking for..."
            className={`${inputClass} resize-none`}
          />
          <p className="text-xs text-philly-muted mt-1.5">
            Be descriptive — this text is what our AI uses to find your perfect match.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-philly-muted uppercase tracking-wider mb-2">
              Pay
            </label>
            <input
              name="pay"
              value={form.pay}
              onChange={handleChange}
              placeholder="e.g. $300 or negotiable"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-philly-muted uppercase tracking-wider mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-philly-muted uppercase tracking-wider mb-2">
            Location
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Old City, Philadelphia"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-philly-neon hover:opacity-90 text-philly-black font-bold py-3.5 rounded-xl transition-opacity mt-2"
        >
          Post Gig — Find My Match
        </button>
      </form>
    </div>
  )
}
