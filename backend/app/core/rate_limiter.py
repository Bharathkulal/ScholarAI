import time
import logging
from typing import Dict, List
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response, JSONResponse

logger = logging.getLogger(__name__)

class RateLimiterMiddleware(BaseHTTPMiddleware):
    """In-memory rate-limiting middleware enforcing max 120 requests per minute per IP."""

    def __init__(self, app, max_requests: int = 120, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.ip_store: Dict[str, List[float]] = {}

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Skip health check & static endpoints
        path = request.url.path
        if path in ["/health", "/", "/version"] or path.startswith("/uploads"):
            return await call_next(request)

        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()

        # Clean old timestamps
        timestamps = self.ip_store.get(client_ip, [])
        valid_timestamps = [ts for ts in timestamps if now - ts < self.window_seconds]

        if len(valid_timestamps) >= self.max_requests:
            logger.warning(f"Rate limit exceeded for IP: {client_ip} on path: {path}")
            return JSONResponse(
                status_code=429,
                content={
                    "success": False,
                    "message": "Rate limit exceeded. Too many requests. Please try again later.",
                    "detail": f"Maximum {self.max_requests} requests per minute allowed."
                },
                headers={
                    "Retry-After": "60",
                    "X-RateLimit-Limit": str(self.max_requests),
                    "X-RateLimit-Remaining": "0"
                }
            )

        valid_timestamps.append(now)
        self.ip_store[client_ip] = valid_timestamps

        response = await call_next(request)
        remaining = max(0, self.max_requests - len(valid_timestamps))
        response.headers["X-RateLimit-Limit"] = str(self.max_requests)
        response.headers["X-RateLimit-Remaining"] = str(remaining)

        return response
