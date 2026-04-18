# backend/routers/ai_router.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
# The .env file has Gemini__ApiKey
GEMINI_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("Gemini__ApiKey")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)

router = APIRouter(prefix="/ai", tags=["AI"])

@router.get("/insights")
def ai_insights(db: Session = Depends(get_db)):
    # Find the busiest hours (adjusting +5:30 for local SLST timezone)
    import datetime
    all_orders = db.query(models.Order.created_at).all()
    hour_counts = {}
    for row in all_orders:
        if not row.created_at: continue
        # created_at is naive UTC from models.py
        sl_time = row.created_at + datetime.timedelta(hours=5, minutes=30)
        h = sl_time.hour
        hour_counts[h] = hour_counts.get(h, 0) + 1
        
    sorted_hours = sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)[:6]
    sorted_hours.sort(key=lambda x: x[0])  # Sort chronologically for the X-axis graph
    busy_hours = [{"hour": h, "orders": c} for h, c in sorted_hours]

    # Find most ordered foods
    popular_foods = (
        db.query(models.MenuItem.name, func.sum(models.OrderItem.quantity).label("total"))
        .join(models.OrderItem, models.MenuItem.id == models.OrderItem.menu_id)
        .group_by(models.MenuItem.name)
        .order_by(func.sum(models.OrderItem.quantity).desc())
        .limit(5)
        .all()
    )
    popular = [{"name": row.name, "total_ordered": int(row.total)} for row in popular_foods]

    # Get AI generated summary
    ai_text = "Not enough data yet for insights. Have some orders placed to view AI insights."
    if busy_hours or popular:
        if GEMINI_KEY:
            try:
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = f"You are a canteen manager AI. Based on this data, give a short, friendly 2-3 sentence insight: Busy hours: {busy_hours}, Popular foods: {popular_foods}"
                response = model.generate_content(prompt)
                ai_text = response.text
            except Exception as e:
                ai_text = f"Insights temporarily unavailable. (Data: {len(busy_hours)} busy hours, {len(popular_foods)} top items)"

    return {
        "busy_hours": busy_hours,
        "popular_foods": popular,
        "ai_summary": ai_text
    }