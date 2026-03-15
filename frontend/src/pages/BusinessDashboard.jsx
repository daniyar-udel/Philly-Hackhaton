import { Link } from 'react-router-dom'
import { useState } from 'react'

// TODO: fetch real gigs from GET /gigs?business_id=...
// TODO: fetch recommended artists from GET /match/artists?gig_id=...

// Real data — Hello Vietnam (restaurant) perspective
const MOCK_GIGS = [
  {
    id: 1,
    title: 'Food Influencer Collab — Spring Menu Launch',
    category: 'Food Influencer',
    status: 'open',
    applicants: 2,
    date: 'Apr 5, 2026',
  },
  {
    id: 2,
    title: 'Social Content Series — Summer Campaign',
    category: 'Social Influencer',
    status: 'open',
    applicants: 1,
    date: 'May 1, 2026',
  },
]

const MOCK_CREATORS = [
  {
    id: 1,
    name: 'Josheatsphilly',
    category: 'Food + Lifestyle Influencer',
    location: 'Philadelphia, PA',
    match_score: 0.97,
    tags: ['restaurants', 'lifestyle', 'content'],
  },
  {
    id: 2,
    name: 'All In Media',
    category: 'Video Storytelling',
    location: 'Philadelphia, PA',
    match_score: 0.84,
    tags: ['video', 'brand', 'story'],
  },
  {
    id: 3,
    name: 'Calan The Artist',
    category: 'Creative Director',
    location: 'Philadelphia, PA',
    match_score: 0.79,
    tags: ['creative', 'direction', 'campaigns'],
  },
  {
    id: 4,
    name: 'A Little Better Co',
    category: 'Brand Designer',
    location: 'Philadelphia, PA',
    match_score: 0.74,
    tags: ['branding', 'design', 'identity'],
  },
]

const CATEGORY_COLORS = {
  'Food Influencer':  'bg-orange-500/20 text-orange-300',
  'Social Influencer':'bg-pink-500/20   text-pink-300',
  'Live Music':       'bg-purple-500/20 text-purple-300',
  'Visual Art':       'bg-blue-500/20   text-blue-300',
  'Brand Designer':   'bg-yellow-500/20 text-yellow-300',
  'Video Storytelling':'bg-red-500/20   text-red-300',
  'Creative Director':'bg-indigo-500/20 text-indigo-300',
}

export default function BusinessDashboard() {
  const [gigs] = useState(MOCK_GIGS)
  const [creators] = useState(MOCK_CREATORS)

  // TODO: useEffect to load real data from API

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-philly-neon text-xs font-semibold uppercase tracking-widest mb-1">Business Dashboard</p>
          <h1 className="text-3xl font-bold text-philly-text">Hello Vietnam 🍜</h1>
          <p className="text-philly-muted mt-1 text-sm">
            Manage your gigs and discover Philly's best local creators.
          </p>
        </div>
        <Link
          to="/business/post-gig"
          className="bg-philly-neon text-philly-black font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          + Post a Gig
        </Link>
      </div>

      {/* Active Gigs */}
      <section>
        <h2 className="text-lg font-bold text-philly-text mb-4">Your Active Gigs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gigs.map((gig) => {
            const catStyle = CATEGORY_COLORS[gig.category] || 'bg-gray-500/20 text-gray-300'
            return (
              <div
                key={gig.id}
                className="bg-philly-card border border-philly-green/20 rounded-2xl p-5 hover:border-philly-neon/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catStyle}`}>
                    {gig.category}
                  </span>
                  <span className="text-xs bg-philly-neon/20 text-philly-neon font-semibold px-2.5 py-1 rounded-full capitalize">
                    {gig.status}
                  </span>
                </div>
                <h3 className="font-bold text-philly-text text-sm leading-snug mb-3">{gig.title}</h3>
                <div className="flex gap-3 text-xs text-philly-muted">
                  <span>📅 {gig.date}</span>
                  <span>👥 {gig.applicants} applicant{gig.applicants !== 1 ? 's' : ''}</span>
                </div>
              </div>
            )
          })}

          {/* Empty state */}
          {gigs.length === 0 && (
            <div className="col-span-2 bg-philly-card border border-dashed border-philly-green/30 rounded-2xl p-8 text-center">
              <p className="text-philly-muted text-sm">No gigs posted yet.</p>
              <Link to="/business/post-gig" className="text-philly-neon text-sm font-semibold mt-2 inline-block hover:underline">
                Post your first gig →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Creators */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-philly-text">Recommended Creators</h2>
          <p className="text-philly-muted text-xs mt-1">
            Matched by vibe — not just keywords. Powered by AI embeddings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {creators.map((creator) => {
            const catStyle = CATEGORY_COLORS[creator.category] || 'bg-gray-500/20 text-gray-300'
            return (
              <div
                key={creator.id}
                className="bg-philly-card border border-philly-green/20 rounded-2xl p-5 flex flex-col hover:border-philly-neon/40 transition-colors"
              >
                {/* Avatar placeholder */}
                <div className="w-12 h-12 rounded-full bg-philly-green/30 flex items-center justify-center text-philly-neon font-bold text-lg mb-3">
                  {creator.name[0]}
                </div>

                <h3 className="font-bold text-philly-text text-sm">{creator.name}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start mt-1 mb-3 ${catStyle}`}>
                  {creator.category}
                </span>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {creator.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-philly-dark text-philly-muted px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-philly-muted">📍 {creator.location.split(',')[0]}</span>
                    <span className="text-philly-neon font-bold text-sm">
                      {Math.round(creator.match_score * 100)}% match
                    </span>
                  </div>

                  {/* Match bar */}
                  <div className="w-full bg-philly-dark rounded-full h-1.5 mb-3">
                    <div
                      className="bg-philly-neon h-1.5 rounded-full"
                      style={{ width: `${Math.round(creator.match_score * 100)}%` }}
                    />
                  </div>

                  <button className="w-full py-2 rounded-xl border border-philly-neon/40 text-philly-neon text-xs font-bold hover:bg-philly-neon/10 transition-colors">
                    View Profile →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
