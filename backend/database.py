import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# In Lambda, DATABASE_URL comes from the environment variable set in lambda.tf.
# Locally, that env var doesn't exist, so we fall back to your local Postgres.
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/jobtracker",
)

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
