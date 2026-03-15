import { Link } from 'react-router-dom'
import { useState } from 'react'

// TODO: fetch real gigs from GET /gigs?business_id=...
// TODO: fetch recommended artists from GET /match/artists?gig_id=...

const MOCK_GIGS = [
  { id: 1, title: 'Food Influencer Collab — Spring Menu Launch', category: 'Food Influencer', status: 'open', applicants: 2, date: 'Apr 5, 2026' },
  { id: 2, title: 'Social Content Series — Summer Campaign',     category: 'Social Influencer', status: 'open', applicants: 1, date: 'May 1, 2026' },
]

const MOCK_CREATORS = [
  { id: 1, name: 'Josheatsphilly',  category: 'Food + Lifestyle Influencer', location: 'Philadelphia', match: 0.97, tags: ['restaurants', 'lifestyle', 'content'] },
  { id: 2, name: 'All In Media',    category: 'Video Storytelling',          location: 'Philadelphia', match: 0.84, tags: ['video', 'brand', 'story'] },
  { id: 3, name: 'Calan The Artist',category: 'Creative Director',           location: 'Philadelphia', match: 0.79, tags: ['creative', 'campaigns'] },
  { id: 4, name: 'A Little Better Co', category: 'Brand Designer',           location: 'Philadelphia', match: 0.74, tags: ['branding', 'identity'] },
]

const CATEGORY_STYLE = {
  'Food Influencer':    'bg-orange-100 text-orange-700',
  'Social Influencer':  'bg-pink-100   text-pink-700',
  'Live Music':         'bg-purple-100 text-purple-700',
  'Video Storytelling': 'bg-red-100    text-red-700',
  'Creative Director':  'bg-indigo-100 text-indigo-700',
  'Brand Designer':     'bg-yellow-100 text-yellow-800',
  'Food + Lifestyle Influencer': 'bg-orange-100 text-orange-700',
}

// Avatar colors cycling
const AVATAR_COLORS = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500']

export default function BusinessDashboard() {
  const [gigs] = useState(MOCK_GIGS)
  const [creators] = useState(MOCK_CREATORS)

  return (
    <div>
      {/* Dark green header */}
      <div className="bg-green-900 px-6 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between animate-fade-up">
          <div>
            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">Business Dashboard</p>
            <h1 className="text-3xl font-bold text-white">Hello Vietnam 🍜</h1>
            <p className="text-green-200 mt-1 text-sm">Manage your gigs and discover Philly's best local creators.</p>
          </div>
          <Link to="/business/post-gig" className="btn bg-green-400 text-green-900 px-5 py-2.5 text-sm whitespace-nowrap">
            + Post a Gig
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* Active Gigs */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Active Gigs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
            {gigs.map((gig) => {
              const catStyle = CATEGORY_STYLE[gig.category] || 'bg-gray-100 text-gray-600'
              return (
                <div key={gig.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${catStyle}`}>{gig.category}</span>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full capitalize">{gig.status}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-3">{gig.title}</h3>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>📅 {gig.date}</span>
                    <span>👥 {gig.applicants} applicant{gig.applicants !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              )
            })}
            {gigs.length === 0 && (
              <div className="col-span-2 bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                <p className="text-gray-400 text-sm mb-2">No gigs posted yet.</p>
                <Link to="/business/post-gig" className="text-green-600 font-bold text-sm hover:underline">
                  Post your first gig →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Recommended Creators */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recommended Creators</h2>
            <p className="text-gray-400 text-xs mt-1">Matched by vibe — not keywords. Powered by AI embeddings.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
            {creators.map((creator, i) => {
              const catStyle = CATEGORY_STYLE[creator.category] || 'bg-gray-100 text-gray-600'
              const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length]
              return (
                <div key={creator.id} className="card p-5 flex flex-col">
                  {/* Avatar */}
                  <div className={`w-12 h-12 ${avatarColor} rounded-full flex items-center justify-center text-white font-black text-xl mb-3`}>
                    {creator.name[0]}
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm">{creator.name}</h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full self-start mt-1 mb-3 ${catStyle}`}>
                    {creator.category}
                  </span>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {creator.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-50 border border-gray-200 text-gray-400 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>

                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">📍 {creator.location}</span>
                      <span className="text-green-600 font-bold text-sm">{Math.round(creator.match * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${Math.round(creator.match * 100)}%`, transition: 'width 0.8s ease' }}
                      />
                    </div>
                    <button className="w-full py-2 rounded-xl border-2 border-green-600 text-green-600 text-xs font-bold hover:bg-green-50 transition-colors duration-200">
                      View Profile →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
