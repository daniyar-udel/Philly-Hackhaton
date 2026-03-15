import { useState } from 'react'

// TODO: fetch recommended gigs from GET /match/gigs?artist_id=...
// TODO: POST /applications when artist applies

const CATEGORY_COLORS = {
  'Live Music':       'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Food Influencer':  'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Social Influencer':'bg-pink-500/20   text-pink-300   border-pink-500/30',
  'Visual Art':       'bg-blue-500/20   text-blue-300   border-blue-500/30',
  'Muralist':         'bg-teal-500/20   text-teal-300   border-teal-500/30',
  'Brand Design':     'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Video/Film':       'bg-red-500/20    text-red-300    border-red-500/30',
  'Community':        'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
}

// Real data — Joshua Mitchell (live music artist) perspective
const MOCK_GIGS = [
  {
    id: 1,
    title: 'Live Performance — Opening Day',
    business: 'Philly Museum of Sports',
    businessType: 'Venue',
    category: 'Live Music',
    pay: '$400',
    date: 'Apr 4, 2026',
    location: 'South Philly',
    match_score: 0.97,
  },
  {
    id: 2,
    title: 'Monthly Live Set',
    business: 'Buds & Bubbly',
    businessType: 'Monthly Event',
    category: 'Live Music',
    pay: '$250',
    date: 'Mar 28, 2026',
    location: 'Center City',
    match_score: 0.93,
  },
  {
    id: 3,
    title: 'Headline — Philly Flannel Fest',
    business: 'Philly Flannel Fest',
    businessType: 'Yearly Event',
    category: 'Live Music',
    pay: '$600',
    date: 'Oct 12, 2026',
    location: 'Northern Liberties',
    match_score: 0.89,
  },
  {
    id: 4,
    title: 'Community Open Mic Night',
    business: 'Indy Hall',
    businessType: 'Community',
    category: 'Community',
    pay: '$150',
    date: 'Apr 10, 2026',
    location: 'Old City',
    match_score: 0.81,
  },
  {
    id: 5,
    title: 'Music for Nonprofit Showcase',
    business: 'We Love Philly',
    businessType: 'Nonprofit',
    category: 'Live Music',
    pay: 'Negotiable',
    date: 'Apr 18, 2026',
    location: 'West Philly',
    match_score: 0.76,
  },
  {
    id: 6,
    title: 'Tech Week After-Party',
    business: 'Diversitech by Tribaja',
    businessType: 'Event',
    category: 'Live Music',
    pay: '$300',
    date: 'Mar 21, 2026',
    location: 'University City',
    match_score: 0.71,
  },
]

export default function ArtistFeed() {
  const [applied, setApplied] = useState(new Set())

  const handleApply = (gigId) => {
    // TODO: POST /applications with { gig_id, artist_id }
    setApplied((prev) => new Set(prev).add(gigId))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div>
        <p className="text-philly-neon text-xs font-semibold uppercase tracking-widest mb-1">Creator Feed</p>
        <h1 className="text-3xl font-bold text-philly-text">Hey, Joshua 👋</h1>
        <p className="text-philly-muted mt-1 text-sm">
          Gigs matched to your profile — ranked by vibe, not keywords.
        </p>
      </div>

      {/* Tiles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_GIGS.map((gig) => {
          const categoryStyle = CATEGORY_COLORS[gig.category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
          const isApplied = applied.has(gig.id)

          return (
            <div
              key={gig.id}
              className="bg-philly-card border border-philly-green/20 rounded-2xl p-5 flex flex-col justify-between hover:border-philly-neon/40 transition-colors"
            >
              {/* Top row: category + match score */}
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryStyle}`}>
                  {gig.category}
                </span>
                <span className="text-philly-neon font-bold text-sm">
                  {Math.round(gig.match_score * 100)}%
                </span>
              </div>

              {/* Gig title + business */}
              <div className="mb-4">
                <h2 className="font-bold text-philly-text text-base leading-snug">{gig.title}</h2>
                <p className="text-philly-muted text-xs mt-1">{gig.business} · {gig.businessType}</p>
              </div>

              {/* Pay + date + location */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-philly-dark text-philly-muted px-2.5 py-1 rounded-full">
                  💰 {gig.pay}
                </span>
                <span className="text-xs bg-philly-dark text-philly-muted px-2.5 py-1 rounded-full">
                  📅 {gig.date}
                </span>
                <span className="text-xs bg-philly-dark text-philly-muted px-2.5 py-1 rounded-full">
                  📍 {gig.location}
                </span>
              </div>

              {/* Apply button */}
              <button
                onClick={() => handleApply(gig.id)}
                disabled={isApplied}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isApplied
                    ? 'bg-philly-green/20 text-philly-neon cursor-not-allowed'
                    : 'bg-philly-neon text-philly-black hover:opacity-90'
                }`}
              >
                {isApplied ? '✓ Applied' : 'Apply Now'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
