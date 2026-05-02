from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

from .routers import auth, stores, ai_analysis

app = FastAPI(
    title="AI Store Reality Engine API",
    description="Backend API for AI-powered Shopify store analysis",
    version="1.0.0"
)

# CORS middleware
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
# Allow localhost on any port for development
allow_origins = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", 
                 "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002"]
if os.getenv("ENVIRONMENT") == "production":
    allow_origins = [frontend_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,  # Allow all localhost dev ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(stores.router, prefix="/api/stores", tags=["Stores"])
app.include_router(ai_analysis.router, prefix="/api/ai", tags=["AI Analysis"])

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {
        "message": "Welcome to AI Store Reality Engine API",
        "documentation": "/docs",
        "health_check": "/api/health"
    }