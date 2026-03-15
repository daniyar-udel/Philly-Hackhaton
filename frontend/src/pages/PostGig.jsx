import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  'Live Music', 'Food Influencer', 'Social Influencer',
  'Mural / Visual Art', 'Brand Design', 'Video / Film',
  'Live Painting', 'Creative Direction', 'DJ', 'Other',
]

// TODO: POST /gigs with form data
// TODO: after posting, trigger embedding generation on the backend
export default function PostGig() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', category: '', description: '', pay: '', date: '', location: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: POST to /api/gigs
    console.log('Posting gig:', form)
    navigate('/business')
  }

  return (
    <div>
      {/* Dark green header */}
      <div className="bg-green-900 px-6 py-10">
        <div className="max-w-xl mx-auto animate-fade-up">
          <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">New Opportunity</p>
          <h1 className="text-3xl font-bold text-white">Post a Gig</h1>
          <p className="text-green-200 mt-1 text-sm">
            Describe what you need — our AI finds your perfect Philly creator.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="card p-7 shadow-lg space-y-5 animate-scale-in">

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gig Title</label>
            <input name="title" required value={form.title} onChange={handleChange}
              placeholder="e.g. Live music for our grand opening" className="field" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
            <select name="category" required value={form.category} onChange={handleChange} className="field cursor-pointer">
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
            <textarea name="description" required rows={4} value={form.description} onChange={handleChange}
              placeholder="Describe the vibe, venue, audience — the more detail, the better the match..."
              className="field resize-none" />
            <p className="text-xs text-gray-400 mt-1.5">💡 This text is what our AI reads to find your match.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pay</label>
              <input name="pay" value={form.pay} onChange={handleChange} placeholder="e.g. $300" className="field" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="field" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
            <input name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. Old City, Philadelphia" className="field" />
          </div>

          <button type="submit" className="btn bg-green-600 hover:bg-green-700 text-white w-full py-3.5 rounded-xl">
            Post Gig — Find My Match
          </button>
        </form>
      </div>
    </div>
  )
}
