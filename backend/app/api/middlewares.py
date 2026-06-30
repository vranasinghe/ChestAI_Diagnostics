import logging
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from jose import jwt, JWTError
from app.config import settings
from app.db.session import SessionLocal
from app.models.audit import AuditLog

logger = logging.getLogger(__name__)

class AuditLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        # Don't audit static file fetches or healthchecks to prevent bloating
        path = request.url.path
        if path.startswith("/storage") or path.startswith("/static") or path in ["/health", "/ready", "/favicon.ico"]:
            return await call_next(request)

        # Extract doctor_id from JWT token in cookies or auth header
        doctor_id = None
        token = request.cookies.get("access_token")
        if not token:
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if token:
            try:
                # Strip token prefix if present
                if token.startswith("Bearer "):
                    token = token.replace("Bearer ", "", 1)
                
                payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
                sub = payload.get("sub")
                if sub:
                    doctor_id = int(sub)
            except (JWTError, ValueError):
                pass

        # Execute request
        response = await call_next(request)

        # Save to DB
        db = SessionLocal()
        try:
            audit_rec = AuditLog(
                doctor_id=doctor_id,
                method=request.method,
                path=path,
                status_code=response.status_code,
                client_ip=request.client.host if request.client else None,
                details=str(request.query_params) if request.query_params else None
            )
            db.add(audit_rec)
            db.commit()
        except Exception as e:
            logger.error(f"Failed to save audit log: {e}")
            db.rollback()
        finally:
            db.close()

        return response
