import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
import models

def clear_data():
    db = SessionLocal()
    try:
        db.query(models.OrderItem).delete()
        db.query(models.Order).delete()
        db.query(models.MenuItem).delete()
        db.commit()
        print("Successfully deleted all sample menu and order data!")
    except Exception as e:
        db.rollback()
        print("Error clearing data:", e)
    finally:
        db.close()

if __name__ == "__main__":
    clear_data()
