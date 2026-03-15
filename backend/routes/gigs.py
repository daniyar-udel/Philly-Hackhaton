from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from db.client import get_supabase

router = APIRouter()


class GigCreate(BaseModel):
    business_id: str
    title: str
    category: str
    description: str
    pay: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None


class GigResponse(BaseModel):
    id: str
    title: str
    category: str
    description: str
    pay: Optional[str]
    date: Optional[str]
    location: Optional[str]
    status: str
    business_id: str


@router.get("/")
async def list_gigs(business_id: Optional[str] = None, category: Optional[str] = None):
    """
    List gigs. Optionally filter by business or category.
    TODO: add pagination (limit/offset)
    """
    supabase = get_supabase()

    try:
        query = supabase.table("gigs").select("*").order("created_at", desc=True)
        if business_id:
            query = query.eq("business_id", business_id)
        if category:
            query = query.eq("category", category)
        result = query.execute()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list gigs: {exc}",
        ) from exc

    return {"gigs": getattr(result, "data", None) or []}


@router.get("/{gig_id}")
async def get_gig(gig_id: str):
    """
    Fetch a single gig and include applicant count.
    """
    supabase = get_supabase()

    try:
        gig_result = supabase.table("gigs").select("*").eq("id", gig_id).limit(1).execute()
        gigs = getattr(gig_result, "data", None) or []
        if not gigs:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Gig not found.",
            )

        application_result = (
            supabase.table("applications").select("id", count="exact").eq("gig_id", gig_id).execute()
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch gig: {exc}",
        ) from exc

    gig = gigs[0]
    gig["applicant_count"] = getattr(application_result, "count", 0) or 0
    return gig


@router.post("/", status_code=201)
async def create_gig(body: GigCreate):
    """
    Create a new gig and generate its embedding for matching.
    TODO: call services/embeddings.py to generate embedding from title+description
    TODO: store embedding in gigs.embedding column (pgvector)
    """
    supabase = get_supabase()
    payload = body.model_dump()

    try:
        owner_result = (
            supabase.table("users")
            .select("id, role")
            .eq("id", body.business_id)
            .limit(1)
            .execute()
        )
        owners = getattr(owner_result, "data", None) or []
        if not owners:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Business user not found.",
            )
        if owners[0]["role"] != "business":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only users with role=business can create gigs.",
            )

        result = supabase.table("gigs").insert(payload).execute()
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create gig: {exc}",
        ) from exc

    rows = getattr(result, "data", None) or []
    if not rows:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gig insert succeeded but no row was returned.",
        )
    return rows[0]


@router.patch("/{gig_id}")
async def update_gig(gig_id: str, body: dict, business_id: str = Query(...)):
    """
    Update a gig owned by a business user.
    TODO: re-embed if title/description changed
    """
    allowed_fields = {"title", "category", "description", "pay", "date", "location", "status"}
    update_payload = {key: value for key, value in body.items() if key in allowed_fields}
    if not update_payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid gig fields provided for update.",
        )

    supabase = get_supabase()

    try:
        existing_result = (
            supabase.table("gigs")
            .select("id, business_id")
            .eq("id", gig_id)
            .limit(1)
            .execute()
        )
        gigs = getattr(existing_result, "data", None) or []
        if not gigs:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Gig not found.",
            )
        if gigs[0]["business_id"] != business_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not own this gig.",
            )

        result = (
            supabase.table("gigs")
            .update(update_payload)
            .eq("id", gig_id)
            .execute()
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update gig: {exc}",
        ) from exc

    rows = getattr(result, "data", None) or []
    return rows[0] if rows else {"gig_id": gig_id, **update_payload}


@router.delete("/{gig_id}", status_code=204)
async def delete_gig(gig_id: str, business_id: str = Query(...)):
    """
    Soft-delete a gig by marking it as cancelled.
    """
    supabase = get_supabase()

    try:
        existing_result = (
            supabase.table("gigs")
            .select("id, business_id")
            .eq("id", gig_id)
            .limit(1)
            .execute()
        )
        gigs = getattr(existing_result, "data", None) or []
        if not gigs:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Gig not found.",
            )
        if gigs[0]["business_id"] != business_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not own this gig.",
            )

        supabase.table("gigs").update({"status": "cancelled"}).eq("id", gig_id).execute()
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete gig: {exc}",
        ) from exc

    return
