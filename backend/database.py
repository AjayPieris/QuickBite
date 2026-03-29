
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()  # Load variables from .env file

DATABASE_URL = os.getenv("DATABASE_URL")

# Create the database engine (this is like opening a connection to the DB)
engine = create_engine(DATABASE_URL)

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