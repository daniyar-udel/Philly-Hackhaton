"""
Supabase client singleton.

Usage:
    from db.client import get_supabase
    supabase = get_supabase()
"""

import os
from functools import lru_cache
from pathlib import Path

import httpx
from dotenv import load_dotenv
import gotrue.http_clients as gotrue_http_clients
import gotrue._sync.gotrue_base_api as gotrue_base_api
from supabase import Client, create_client


load_dotenv(Path(__file__).resolve().parents[1] / ".env")


class _CompatSyncClient(httpx.Client):
    def __init__(self, *args, proxy=None, **kwargs):
        if proxy is not None and "proxies" not in kwargs:
            kwargs["proxies"] = proxy
        super().__init__(*args, **kwargs)

    def aclose(self) -> None:
        self.close()


gotrue_http_clients.SyncClient = _CompatSyncClient
gotrue_base_api.SyncClient = _CompatSyncClient


# TODO: replace with pydantic-settings config class
@lru_cache(maxsize=1)
def get_supabase() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env")
    return create_client(url, key)
