# backend/routers/menu_router.py
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
import models, schemas, auth
from cloudinary_config import upload_image

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("", response_model=list[schemas.MenuItemOut])
@router.get("/", response_model=list[schemas.MenuItemOut])
def get_menu(db: Session = Depends(get_db)):
    """Anyone can view the menu"""
    return db.query(models.MenuItem).all()

@router.post("/", response_model=schemas.MenuItemOut)
def add_item(
    name: str = Form(...),
    price: float = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(auth.require_admin)  # Only admins can add items
):
    image_url = upload_image(file.file) if file else None
    item = models.MenuItem(name=name, price=price, image_url=image_url)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{item_id}", response_model=schemas.MenuItemOut)
def update_item(
    item_id: int,
    name: str = Form(...),
    price: float = Form(...),
    db: Session = Depends(get_db),
    admin=Depends(auth.require_admin)
):
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.name = name
    item.price = price
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db), admin=Depends(auth.require_admin)):
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}