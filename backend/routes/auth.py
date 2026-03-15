from typing import Literal

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

from db.client import get_supabase

router = APIRouter()


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    role: Literal["artist", "business"]
    display_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


def _auth_error_message(exc: Exception) -> str:
    response = getattr(exc, "response", None)
    if response is not None:
        json_payload = getattr(response, "json", None)
        if callable(json_payload):
            try:
                data = json_payload()
                if isinstance(data, dict):
                    return data.get("msg") or data.get("message") or str(exc)
            except Exception:
                pass
    return str(exc)


@router.post("/signup")
async def signup(body: SignUpRequest):
    """
    Register a new user in Supabase Auth and create the app-side profile row.
    """
    supabase = get_supabase()

    try:
        response = supabase.auth.sign_up(
            {
                "email": body.email,
                "password": body.password,
                "options": {"data": {"role": body.role, "display_name": body.display_name}},
            }
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Supabase signup failed: {_auth_error_message(exc)}",
        ) from exc

    user = getattr(response, "user", None)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Signup succeeded but no user was returned by Supabase.",
        )

    user_id = str(user.id)

    try:
        supabase.table("users").upsert({"id": user_id, "role": body.role}).execute()

        if body.role == "artist":
            supabase.table("artist_profiles").upsert(
                {
                    "user_id": user_id,
                    "display_name": body.display_name,
                }
            ).execute()
        else:
            supabase.table("business_profiles").upsert(
                {
                    "user_id": user_id,
                    "business_name": body.display_name,
                }
            ).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"User created, but profile setup failed: {_auth_error_message(exc)}",
        ) from exc

    session = getattr(response, "session", None)
    return {
        "user_id": user_id,
        "email": body.email,
        "role": body.role,
        "display_name": body.display_name,
        "access_token": getattr(session, "access_token", None),
        "refresh_token": getattr(session, "refresh_token", None),
    }


@router.post("/login")
async def login(body: LoginRequest):
    """
    Authenticate a user with Supabase Auth and return session tokens plus role.
    """
    supabase = get_supabase()

    try:
        response = supabase.auth.sign_in_with_password(
            {"email": body.email, "password": body.password}
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {_auth_error_message(exc)}",
        ) from exc

    user = getattr(response, "user", None)
    session = getattr(response, "session", None)
    if user is None or session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid login response from Supabase.",
        )

    try:
        role_result = (
            supabase.table("users").select("role").eq("id", str(user.id)).limit(1).execute()
        )
        role_rows = getattr(role_result, "data", None) or []
        role = role_rows[0]["role"] if role_rows else None
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login succeeded, but role lookup failed: {_auth_error_message(exc)}",
        ) from exc

    return {
        "user_id": str(user.id),
        "email": body.email,
        "role": role,
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
    }


@router.post("/logout")
async def logout():
    """
    TODO: call supabase.auth.sign_out()
    TODO: invalidate session on client by clearing tokens
    """
    return {"message": "logout placeholder"}
