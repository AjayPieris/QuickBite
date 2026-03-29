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
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

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

    # Ask Gemini to generate a human-friendly summary
    prompt = f"""
    You are a canteen manager AI. Based on this data, give a short, friendly 2-3 sentence insight:
    Busy hours: {busy_hours}
    Popular foods: {popular}
    """
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)

    return {
        "busy_hours": busy_hours,
        "popular_foods": popular,
        "ai_summary": response.text
    }