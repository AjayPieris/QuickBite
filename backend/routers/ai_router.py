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
    # Find the busiest hours (group orders by hour)
    busy_hours_data = (
        db.query(func.extract('hour', models.Order.created_at).label('hour'), func.count().label('count'))
        .group_by('hour')
        .order_by(func.count().desc())
        .limit(3)
        .all()
    )
    busy_hours = [{"hour": int(row.hour), "orders": row.count} for row in busy_hours_data]

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