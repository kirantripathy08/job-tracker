from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# In production this comes from an env var, never hardcoded.
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/jobtracker"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a DB session, always closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
