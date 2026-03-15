from fastapi import APIRouter, HTTPException, Query

from db.client import get_supabase
from services.embeddings import embed_artist_profile, embed_gig
from services.matching import top_artists_for_gig, top_gigs_for_artist

router = APIRouter()


@router.get("/artists")
async def match_artists_to_gig(
    gig_id: str = Query(..., description="Find artists that match this gig"),
    limit: int = Query(10, ge=1, le=50),
):
    supabase = get_supabase()
    result = supabase.table("gigs").select("id, embedding").eq("id", gig_id).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Gig not found")

    embedding = result.data[0].get("embedding")
    if not embedding:
        raise HTTPException(status_code=409, detail="Gig embedding has not been generated yet")

    matches = await top_artists_for_gig(embedding, limit)
    return {"gig_id": gig_id, "matches": matches}


@router.get("/gigs")
async def match_gigs_to_artist(
    artist_id: str = Query(..., description="Find gigs that match this artist"),
    limit: int = Query(10, ge=1, le=50),
):
    supabase = get_supabase()
    result = (
        supabase.table("artist_profiles")
        .select("user_id, embedding")
        .eq("user_id", artist_id)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Artist profile not found")

    embedding = result.data[0].get("embedding")
    if not embedding:
        raise HTTPException(status_code=409, detail="Artist embedding has not been generated yet")

    matches = await top_gigs_for_artist(embedding, limit)
    return {"artist_id": artist_id, "matches": matches}


@router.post("/embed/gig/{gig_id}")
async def trigger_gig_embedding(gig_id: str):
    supabase = get_supabase()
    result = (
        supabase.table("gigs")
        .select("id, title, category, description, pay, date, location")
        .eq("id", gig_id)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Gig not found")

    gig = result.data[0]
    embedding = await embed_gig(gig)
    supabase.table("gigs").update({"embedding": embedding}).eq("id", gig_id).execute()
    return {"gig_id": gig_id, "embedding_dimensions": len(embedding), "message": "Gig embedding stored"}


@router.post("/embed/artist/{user_id}")
async def trigger_artist_embedding(user_id: str):
    supabase = get_supabase()
    result = (
        supabase.table("artist_profiles")
        .select("user_id, display_name, bio, category, skills, location")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Artist profile not found")

    profile = result.data[0]
    embedding = await embed_artist_profile(profile)
    supabase.table("artist_profiles").update({"embedding": embedding}).eq("user_id", user_id).execute()
    return {"user_id": user_id, "embedding_dimensions": len(embedding), "message": "Artist embedding stored"}
