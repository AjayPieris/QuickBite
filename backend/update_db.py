from database import engine
from sqlalchemy import text

try:
    with engine.begin() as con:
        con.execute(text("ALTER TABLE menu ADD COLUMN category VARCHAR DEFAULT 'All'"))
    print("Database altered successfully")
except Exception as e:
    print(f"Error: {e}")
