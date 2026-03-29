# backend/main.py
# This is where everything connects together

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth_router, user_router, menu_router, order_router, ai_router

# Create all DB tables (if they don't exist yet)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="QuickBite API")

# Allow the React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(menu_router.router)
app.include_router(order_router.router)
app.include_router(ai_router.router)

@app.get("/")
def root():
    return {"message": "QuickBite API is running!"}