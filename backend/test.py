import asyncio
from typing import Any

import numpy as np

from services.embeddings import embed_artist_profile, embed_gig


SAMPLE_ARTIST = {
    "display_name": "Maya Rivers",
    "bio": "Acoustic guitarist and singer who performs at cafes, bookstore events, and small community gatherings.",
    "category": "Musician",
    "skills": ["acoustic guitar", "live performance", "vocals"],
    "location": "Philadelphia",
}

SAMPLE_GIGS = [
    {
        "title": "Coffee Shop Opening Night Performer",
        "category": "Live Music",
        "description": "Looking for an upbeat acoustic musician to perform at our cafe launch event for a relaxed crowd.",
        "pay": "$200",
        "date": "2026-03-20",
        "location": "Philadelphia",
    },
    {
        "title": "Mural Artist for Outdoor Wall",
        "category": "Visual Art",
        "description": "Need a muralist to create a colorful public-facing wall piece for our neighborhood shop.",
        "pay": "$800",
        "date": "Flexible",
        "location": "Philadelphia",
    },
    {
        "title": "DJ for Late-Night Bar Event",
        "category": "DJ",
        "description": "Seeking a DJ for a high-energy weekend event with dance and electronic music.",
        "pay": "$300",
        "date": "2026-03-28",
        "location": "Philadelphia",
    },
]


def cosine_similarity(a: list[float], b: list[float]) -> float:
    a_vec = np.array(a, dtype=float)
    b_vec = np.array(b, dtype=float)
    a_norm = np.linalg.norm(a_vec)
    b_norm = np.linalg.norm(b_vec)
    if a_norm == 0 or b_norm == 0:
        return 0.0
    return float(np.dot(a_vec, b_vec) / (a_norm * b_norm))


async def main() -> None:
    print("Generating artist embedding...")
    artist_embedding = await embed_artist_profile(SAMPLE_ARTIST)
    print(f"Artist embedding dimensions: {len(artist_embedding)}")
    print()

    ranked_matches: list[dict[str, Any]] = []
    for gig in SAMPLE_GIGS:
        print(f"Generating gig embedding for: {gig['title']}")
        gig_embedding = await embed_gig(gig)
        score = cosine_similarity(artist_embedding, gig_embedding)
        ranked_matches.append(
            {
                "title": gig["title"],
                "category": gig["category"],
                "score": score,
            }
        )

    ranked_matches.sort(key=lambda item: item["score"], reverse=True)

    print("\nRanked gig matches for sample artist:\n")
    for index, match in enumerate(ranked_matches, start=1):
        print(
            f"{index}. {match['title']} "
            f"({match['category']}) -> similarity {match['score']:.4f}"
        )


if __name__ == "__main__":
    asyncio.run(main())
