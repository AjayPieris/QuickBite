
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()  # Load variables from .env file

DATABASE_URL = os.getenv("DATABASE_URL")

# MySQL-optimized engine: pool_pre_ping reconnects dropped connections automatically
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,          # Detect and recover stale connections
    pool_recycle=1800,           # Recycle connections every 30 mins
    pool_size=10,                # Keep 10 connections ready
    max_overflow=20,             # Allow up to 20 extra connections under load
    connect_args={"charset": "utf8mb4"},
)

# Each request gets its own database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that all our models will inherit from
Base = declarative_base()

# This function gives us a DB session for each API request
def get_db():
    db = SessionLocal()
    try:
        yield db  # "yield" means: use this, then clean up after
    finally:
        db.close()