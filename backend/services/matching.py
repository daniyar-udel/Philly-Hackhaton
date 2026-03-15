from db.client import get_supabase


async def top_artists_for_gig(gig_embedding: list[float], limit: int = 10) -> list[dict]:
    supabase = get_supabase()
    result = supabase.rpc(
        "match_artists",
        {"query_embedding": gig_embedding, "match_count": limit},
    ).execute()
    return result.data or []


async def top_gigs_for_artist(artist_embedding: list[float], limit: int = 10) -> list[dict]:
    supabase = get_supabase()
    result = supabase.rpc(
        "match_gigs",
        {"query_embedding": artist_embedding, "match_count": limit},
    ).execute()
    return result.data or []
