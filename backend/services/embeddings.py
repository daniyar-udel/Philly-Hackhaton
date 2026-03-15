import os

import httpx
import numpy as np
from dotenv import load_dotenv

load_dotenv()

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIM = 1536
EMBEDDING_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{EMBEDDING_MODEL}:embedContent"

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise RuntimeError("GOOGLE_API_KEY must be set in .env")


def _normalize_embedding(values: list[float]) -> list[float]:
    vector = np.array(values, dtype=float)
    norm = np.linalg.norm(vector)
    if norm == 0:
        return vector.tolist()
    return (vector / norm).tolist()


def _compact_text(*parts: str) -> str:
    return " ".join(part.strip() for part in parts if part and part.strip())


async def embed_text(text: str) -> list[float]:
    cleaned_text = " ".join(text.strip().split())
    if not cleaned_text:
        raise ValueError("Text to embed cannot be empty")

    payload = {
        "content": {"parts": [{"text": cleaned_text}]},
        "taskType": "SEMANTIC_SIMILARITY",
        "outputDimensionality": EMBEDDING_DIM,
    }
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(EMBEDDING_URL, headers=headers, json=payload)
        response.raise_for_status()

    embedding = response.json()["embedding"]["values"]
    return _normalize_embedding(embedding)


async def embed_gig(gig: dict) -> list[float]:
    text = _compact_text(
        gig.get("title", ""),
        f"Category: {gig.get('category', 'General')}.",
        gig.get("description", ""),
        f"Location: {gig.get('location', 'Philadelphia')}.",
        f"Pay: {gig.get('pay', 'Negotiable')}.",
        f"Date: {gig.get('date', 'Flexible')}.",
    )
    return await embed_text(text)


async def embed_artist_profile(profile: dict) -> list[float]:
    skills = profile.get("skills", [])
    if isinstance(skills, str):
        skills_text = skills
    else:
        skills_text = ", ".join(skills)

    text = _compact_text(
        f"{profile.get('display_name', 'Artist')} is a {profile.get('category', 'artist')}.",
        f"Based in {profile.get('location', 'Philadelphia')}.",
        profile.get("bio", ""),
        f"Skills: {skills_text}.",
    )
    return await embed_text(text)
