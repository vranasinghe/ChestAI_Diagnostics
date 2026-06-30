import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.rate_limit import limiter
from app.db import init_db
from app.api import routes_auth, routes_patient, routes_xray, routes_comparison, routes_report, routes_chatbot
from app.api.middlewares import AuditLogMiddleware
from app.services.rag import init_rag_system
from fastapi.staticfiles import StaticFiles
from prometheus_fastapi_instrumentator import Instrumentator


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create database tables and initialize RAG
    init_db.create_tables()
    try:
        init_rag_system()
    except Exception as e:
        print(f"Failed to initialize RAG: {e}")
    yield
    # Shutdown: nothing needed for now


app = FastAPI(
    title="XRAY ML System API",
    description="Backend for the WEDAKAM X-Ray disease classification system",
    version="1.0.0",
    lifespan=lifespan,
)

Instrumentator().instrument(app).expose(app)
os.makedirs("/storage", exist_ok=True)
app.mount("/storage", StaticFiles(directory="/storage"), name="storage")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(AuditLogMiddleware)

# Allow CORS origins from environment variable or default to local development servers
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
else:
    allowed_origins = [
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174",
        "http://localhost:5175", "http://127.0.0.1:5175",
        "http://localhost:5176", "http://127.0.0.1:5176",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(routes_auth.router)
app.include_router(routes_patient.router)
app.include_router(routes_xray.router)
app.include_router(routes_comparison.router)
app.include_router(routes_report.router)
app.include_router(routes_chatbot.router)


@app.get("/")
def root_check():
    return {"status": "ok", "message": "XRAY ML System is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/ready")
def ready_check():
    return {"status": "ready"}
