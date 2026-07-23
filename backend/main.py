from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.core.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Media Collection API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Media Collection API! 🚀"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}