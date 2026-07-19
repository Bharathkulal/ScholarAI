import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("app.middleware.request_logging")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that captures statistics for incoming HTTP requests
    and outputs structured logs tracking path, client, status code, and latency.
    """
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        method = request.method
        path = request.url.path
        client_host = request.client.host if request.client else "unknown"
        
        try:
            response = await call_next(request)
            duration_ms = (time.time() - start_time) * 1000
            # Exclude health-check polling from noisy logs if desired, or log everything
            logger.info(
                f"Client: {client_host} | Request: {method} {path} | "
                f"Status: {response.status_code} | Duration: {duration_ms:.2f}ms"
            )
            return response
        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000
            logger.error(
                f"Client: {client_host} | Request: {method} {path} | "
                f"Status: FAILED | Exception: {str(e)} | Duration: {duration_ms:.2f}ms"
            )
            raise e
