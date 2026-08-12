from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# CHANGE YOUR_PASSWORD TO YOUR ACTUAL POSTGRESQL PASSWORD
DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost/media_collection_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()