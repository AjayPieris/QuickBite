

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ── Auth schemas ──────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    profile_image_url: Optional[str] = None

    class Config:
        from_attributes = True  # Allows reading from SQLAlchemy objects

class Token(BaseModel):
    access_token: str
    token_type: str

# ── Menu schemas ──────────────────────────────────────
class MenuItemCreate(BaseModel):
    name: str
    price: float
    category: Optional[str] = "All"
    image_url: Optional[str] = None

class MenuItemOut(BaseModel):
    id: int
    name: str
    price: float
    category: Optional[str] = "All"
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

# ── Order schemas ─────────────────────────────────────
class OrderItemIn(BaseModel):
    menu_id: int
    quantity: int

class OrderCreate(BaseModel):
    pickup_time: datetime
    items: List[OrderItemIn]

class OrderItemOut(BaseModel):
    id: int
    quantity: int
    menu_item: MenuItemOut

    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    total_price: float
    pickup_time: datetime
    status: str
    created_at: datetime
    user: Optional[UserOut] = None
    items: Optional[List[OrderItemOut]] = []

    class Config:
        from_attributes = True