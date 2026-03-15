import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth'

const CATEGORY_STYLE = {
  'Live Music':        'bg-purple-100 text-purple-700',
  'Food Influencer':   'bg-orange-100 text-orange-700',
  'Social Influencer': 'bg-pink-100   text-pink-700',
  'Visual Art':        'bg-blue-100   text-blue-700',
  'Muralist':          'bg-teal-100   text-teal-700',
  'Brand Design':      'bg-yellow-100 text-yellow-800',
  'Video/Film':        'bg-red-100    text-red-700',
  'Community':         'bg-green-100  text-green-700',
}

// Fallback mock data shown while embeddings are being generated or backend is warming up
const MOCK_GIGS = [
  { id: 1, title: 'Live Performance — Opening Day',    business_name: 'Philly Museum of Sports', category: 'Live Music',        pay: '$400',       date: 'Apr 4, 2026',  location: 'South Philly',      similarity: 0.97 },
  { id: 2, title: 'Monthly Live Set',                  business_name: 'Buds & Bubbly',           category: 'Live Music',        pay: '$250',       date: 'Mar 28, 2026', location: 'Center City',        similarity: 0.93 },
  { id: 3, title: 'Headline — Philly Flannel Fest',    business_name: 'Philly Flannel Fest',     category: 'Live Music',        pay: '$600',       date: 'Oct 12, 2026', location: 'Northern Liberties', similarity: 0.89 },
  { id: 4, title: 'Community Open Mic Night',          business_name: 'Indy Hall',               category: 'Community',         pay: '$150',       date: 'Apr 10, 2026', location: 'Old City',           similarity: 0.81 },
  { id: 5, title: 'Music for Nonprofit Showcase',      business_name: 'We Love Philly',          category: 'Live Music',        pay: 'Negotiable', date: 'Apr 18, 2026', location: 'West Philly',        similarity: 0.76 },
  { id: 6, title: 'Tech Week After-Party Set',         business_name: 'Diversitech by Tribaja',  category: 'Live Music',        pay: '$300',       date: 'Mar 21, 2026', location: 'University City',    similarity: 0.71 },
]

function formatDate(dateStr) {
  if (!dateStr) return null
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return dateStr }
}

export default function ArtistFeed() {
  const { user } = useAuth()
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [applied, setApplied] = useState(new Set())

  useEffect(() => {
    if (!user) return

    fetch(`/api/match/gigs?artist_id=${user.user_id}`)
      .then(async (res) => {
        if (!res.ok) return null
        return res.json()
      })
      .then((data) => {
        const matches = data?.matches
        setGigs(matches?.length ? matches : MOCK_GIGS)
      })
      .catch(() => setGigs(MOCK_GIGS))
      .finally(() => setLoading(false))
  }, [user])

  const handleApply = (id) => {
    setApplied((prev) => new Set(prev).add(id))
  }

  const firstName = user?.display_name?.split(' ')[0] || 'there'

  return (
    <div>
      {/* Dark green header */}
      <div className="bg-green-900 px-6 py-10">
        <div className="max-w-6xl mx-auto animate-fade-up">
          <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">Creator Feed</p>
          <h1 className="text-3xl font-bold text-white">Hey, {firstName} 👋</h1>
          <p className="text-green-200 mt-1 text-sm">
            {loading ? 'Finding your best gig matches...' : `${gigs.length} gigs matched to your profile — ranked by vibe, not keywords.`}
          </p>
        </div>
      </div>

      {/* Tiles */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {gigs.map((gig) => {
              const catStyle = CATEGORY_STYLE[gig.category] || 'bg-gray-100 text-gray-600'
              const isApplied = applied.has(gig.id)
              const matchPct = Math.round((gig.similarity ?? 0) * 100)

              return (
                <div key={gig.id} className="card p-5 flex flex-col">
                  {/* Category + match */}
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${catStyle}`}>
                      {gig.category}
                    </span>
                    {matchPct > 0 && (
                      <span className="text-green-600 font-bold text-sm">{matchPct}% match</span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-bold text-gray-900 text-base leading-snug mb-1">{gig.title}</h2>
                  {gig.business_name && (
                    <p className="text-gray-400 text-xs mb-1">{gig.business_name}</p>
                  )}
                  {gig.description && (
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{gig.description}</p>
                  )}

                  {/* Match bar */}
                  {matchPct > 0 && (
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${matchPct}%`, transition: 'width 0.8s ease' }}
                      />
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {gig.pay && <span className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded-full">💰 {gig.pay}</span>}
                    {gig.date && <span className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded-full">📅 {formatDate(gig.date)}</span>}
                    {gig.location && <span className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded-full">📍 {gig.location}</span>}
                  </div>

                  {/* Apply button */}
                  <button
                    onClick={() => handleApply(gig.id)}
                    disabled={isApplied}
                    className={`mt-auto w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                      isApplied
                        ? 'bg-green-50 text-green-600 border-2 border-green-200 cursor-not-allowed'
                        : 'btn bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isApplied ? '✓ Applied!' : 'Apply Now'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
