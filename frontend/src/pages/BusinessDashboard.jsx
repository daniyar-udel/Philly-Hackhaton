import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth'

const MOCK_GIGS = [
  { id: 1, title: 'Food Influencer Collab — Spring Menu Launch', category: 'Food Influencer', status: 'open', applicant_count: 2, date: 'Apr 5, 2026' },
  { id: 2, title: 'Social Content Series — Summer Campaign',     category: 'Social Influencer', status: 'open', applicant_count: 1, date: 'May 1, 2026' },
]

const MOCK_CREATORS = [
  { user_id: '1', display_name: 'Josheatsphilly',   category: 'Food + Lifestyle Influencer', location: 'Philadelphia', similarity: 0.97, skills: ['restaurants', 'lifestyle', 'content'] },
  { user_id: '2', display_name: 'All In Media',     category: 'Video Storytelling',          location: 'Philadelphia', similarity: 0.84, skills: ['video', 'brand', 'story'] },
  { user_id: '3', display_name: 'Calan The Artist', category: 'Creative Director',           location: 'Philadelphia', similarity: 0.79, skills: ['creative', 'campaigns'] },
  { user_id: '4', display_name: 'A Little Better Co', category: 'Brand Designer',            location: 'Philadelphia', similarity: 0.74, skills: ['branding', 'identity'] },
]

const CATEGORY_STYLE = {
  'Food Influencer':             'bg-orange-100 text-orange-700',
  'Social Influencer':           'bg-pink-100   text-pink-700',
  'Live Music':                  'bg-purple-100 text-purple-700',
  'Video Storytelling':          'bg-red-100    text-red-700',
  'Creative Director':           'bg-indigo-100 text-indigo-700',
  'Brand Designer':              'bg-yellow-100 text-yellow-800',
  'Food + Lifestyle Influencer': 'bg-orange-100 text-orange-700',
}

const AVATAR_COLORS = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500']

function formatDate(dateStr) {
  if (!dateStr) return null
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return dateStr }
}

export default function BusinessDashboard() {
  const { user } = useAuth()
  const [gigs, setGigs] = useState([])
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        // 1. Fetch this business's gigs
        const gigsRes = await fetch(`/api/gigs/?business_id=${user.user_id}`)
        const gigsData = gigsRes.ok ? await gigsRes.json() : null
        const realGigs = gigsData?.gigs || []
        setGigs(realGigs.length ? realGigs : MOCK_GIGS)

        // 2. Fetch recommended creators based on the first open gig
        const firstGig = realGigs.find((g) => g.status === 'open') || realGigs[0]
        if (firstGig) {
          const matchRes = await fetch(`/api/match/artists?gig_id=${firstGig.id}`)
          if (matchRes.ok) {
            const matchData = await matchRes.json()
            const matches = matchData?.matches || []
            setCreators(matches.length ? matches : MOCK_CREATORS)
          } else {
            setCreators(MOCK_CREATORS)
          }
        } else {
          setCreators(MOCK_CREATORS)
        }
      } catch {
        setGigs(MOCK_GIGS)
        setCreators(MOCK_CREATORS)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const businessName = user?.display_name || 'Your Business'

  return (
    <div>
      {/* Dark green header */}
      <div className="bg-green-900 px-6 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between animate-fade-up">
          <div>
            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">Business Dashboard</p>
            <h1 className="text-3xl font-bold text-white">{businessName} 🍜</h1>
            <p className="text-green-200 mt-1 text-sm">Manage your gigs and discover Philly's best local creators.</p>
          </div>
          <Link to="/business/post-gig" className="btn bg-green-400 text-green-900 px-5 py-2.5 text-sm whitespace-nowrap rounded-full">
            + Post a Gig
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* Active Gigs */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Active Gigs</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
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
                      {gig.date && <span>📅 {formatDate(gig.date)}</span>}
                      <span>👥 {gig.applicant_count ?? 0} applicant{(gig.applicant_count ?? 0) !== 1 ? 's' : ''}</span>
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
          )}
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
              const matchPct = Math.round((creator.similarity ?? 0) * 100)
              const tags = creator.skills || []

              return (
                <div key={creator.user_id} className="card p-5 flex flex-col">
                  <div className={`w-12 h-12 ${avatarColor} rounded-full flex items-center justify-center text-white font-black text-xl mb-3`}>
                    {(creator.display_name || '?')[0]}
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm">{creator.display_name}</h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full self-start mt-1 mb-3 ${catStyle}`}>
                    {creator.category}
                  </span>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-50 border border-gray-200 text-gray-400 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between">
                      {creator.location && <span className="text-xs text-gray-400">📍 {creator.location}</span>}
                      {matchPct > 0 && <span className="text-green-600 font-bold text-sm">{matchPct}%</span>}
                    </div>
                    {matchPct > 0 && (
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${matchPct}%`, transition: 'width 0.8s ease' }}
                        />
                      </div>
                    )}
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
