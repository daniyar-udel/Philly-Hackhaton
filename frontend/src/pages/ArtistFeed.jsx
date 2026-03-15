import { useState } from 'react'

// TODO: fetch recommended gigs from GET /match/gigs?artist_id=...
// TODO: POST /applications when artist applies

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

// Real Philly data — Joshua Mitchell (live music artist) perspective
const MOCK_GIGS = [
  { id: 1, title: 'Live Performance — Opening Day',    business: 'Philly Museum of Sports', type: 'Venue',        category: 'Live Music', pay: '$400', date: 'Apr 4, 2026',  location: 'South Philly',      match: 0.97 },
  { id: 2, title: 'Monthly Live Set',                  business: 'Buds & Bubbly',           type: 'Monthly Event', category: 'Live Music', pay: '$250', date: 'Mar 28, 2026', location: 'Center City',        match: 0.93 },
  { id: 3, title: 'Headline — Philly Flannel Fest',    business: 'Philly Flannel Fest',     type: 'Yearly Event',  category: 'Live Music', pay: '$600', date: 'Oct 12, 2026', location: 'Northern Liberties', match: 0.89 },
  { id: 4, title: 'Community Open Mic Night',          business: 'Indy Hall',               type: 'Community',     category: 'Community',  pay: '$150', date: 'Apr 10, 2026', location: 'Old City',           match: 0.81 },
  { id: 5, title: 'Music for Nonprofit Showcase',      business: 'We Love Philly',          type: 'Nonprofit',     category: 'Live Music', pay: 'Negotiable', date: 'Apr 18, 2026', location: 'West Philly',   match: 0.76 },
  { id: 6, title: 'Tech Week After-Party Set',         business: 'Diversitech by Tribaja',  type: 'Event',         category: 'Live Music', pay: '$300', date: 'Mar 21, 2026', location: 'University City',    match: 0.71 },
]

export default function ArtistFeed() {
  const [applied, setApplied] = useState(new Set())

  const handleApply = (id) => {
    // TODO: POST /applications { gig_id, artist_id }
    setApplied((prev) => new Set(prev).add(id))
  }

  return (
    <div>
      {/* Dark green header */}
      <div className="bg-green-900 px-6 py-10">
        <div className="max-w-6xl mx-auto animate-fade-up">
          <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">Creator Feed</p>
          <h1 className="text-3xl font-bold text-white">Hey, Joshua 👋</h1>
          <p className="text-green-200 mt-1 text-sm">
            {MOCK_GIGS.length} gigs matched to your profile — ranked by vibe, not keywords.
          </p>
        </div>
      </div>

      {/* Tiles */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {MOCK_GIGS.map((gig) => {
            const catStyle = CATEGORY_STYLE[gig.category] || 'bg-gray-100 text-gray-600'
            const isApplied = applied.has(gig.id)

            return (
              <div key={gig.id} className="card p-5 flex flex-col">
                {/* Category + match */}
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${catStyle}`}>
                    {gig.category}
                  </span>
                  <span className="text-green-600 font-bold text-sm">
                    {Math.round(gig.match * 100)}% match
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-bold text-gray-900 text-base leading-snug mb-1">{gig.title}</h2>
                <p className="text-gray-400 text-xs mb-3">{gig.business} · {gig.type}</p>

                {/* Match bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${Math.round(gig.match * 100)}%`, transition: 'width 0.8s ease' }}
                  />
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded-full">💰 {gig.pay}</span>
                  <span className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded-full">📅 {gig.date}</span>
                  <span className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded-full">📍 {gig.location}</span>
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
      </div>
    </div>
  )
}
