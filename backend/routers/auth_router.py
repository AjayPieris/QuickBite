# backend/routers/auth_router.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
import models, schemas, auth
from cloudinary_config import upload_image

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=schemas.UserOut)
def register(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Check if email already exists
    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Upload image if provided
    image_url = upload_image(file.file) if file else None

    new_user = models.User(
        name=name,
        email=email,
        password=auth.hash_password(password),  # Never store plain passwords!
        profile_image_url=image_url
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()

    if not user or not auth.verify_password(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = auth.create_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}