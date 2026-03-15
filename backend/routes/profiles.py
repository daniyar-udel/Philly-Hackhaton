from typing import List, Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from db.client import get_supabase

router = APIRouter()


class ArtistProfileUpsert(BaseModel):
    display_name: str
    bio: str
    category: str          # e.g. "Jazz Musician", "Muralist"
    skills: List[str]      # e.g. ["piano", "improvisation"]
    location: Optional[str] = None
    portfolio_url: Optional[str] = None
    instagram_handle: Optional[str] = None


class BusinessProfileUpsert(BaseModel):
    business_name: str
    description: str
    industry: str
    location: Optional[str] = None
    website: Optional[str] = None


def _first_row(result) -> Optional[dict]:
    rows = getattr(result, "data", None) or []
    return rows[0] if rows else None


@router.get("/artist/{user_id}")
async def get_artist_profile(user_id: str):
    """
    Fetch an artist profile from Supabase.
    """
    supabase = get_supabase()
    try:
        result = (
            supabase.table("artist_profiles")
            .select("*")
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch artist profile: {exc}",
        ) from exc

    row = _first_row(result)
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist profile not found.",
        )
    return row


@router.put("/artist/{user_id}")
async def upsert_artist_profile(user_id: str, body: ArtistProfileUpsert):
    """
    Create or update an artist profile.
    TODO: re-generate embedding from bio+skills+category
    TODO: store embedding in artist_profiles.embedding (pgvector)
    """
    supabase = get_supabase()
    payload = {"user_id": user_id, **body.model_dump()}

    try:
        # Ensure the user row exists (handles users whose signup completed in
        # auth.users but failed before the public.users insert)
        supabase.table("users").upsert({"id": user_id, "role": "artist"}).execute()
        result = supabase.table("artist_profiles").upsert(payload).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save artist profile: {exc}",
        ) from exc

    row = _first_row(result)
    return row or payload


@router.get("/business/{user_id}")
async def get_business_profile(user_id: str):
    """
    Fetch a business profile from Supabase.
    """
    supabase = get_supabase()
    try:
        result = (
            supabase.table("business_profiles")
            .select("*")
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch business profile: {exc}",
        ) from exc

    row = _first_row(result)
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business profile not found.",
        )
    return row


@router.put("/business/{user_id}")
async def upsert_business_profile(user_id: str, body: BusinessProfileUpsert):
    """
    Create or update a business profile.
    TODO: re-generate embedding from description+industry
    """
    supabase = get_supabase()
    payload = {"user_id": user_id, **body.model_dump()}

    try:
        supabase.table("users").upsert({"id": user_id, "role": "business"}).execute()
        result = supabase.table("business_profiles").upsert(payload).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save business profile: {exc}",
        ) from exc

    row = _first_row(result)
    return row or payload
