# backend/routers/user_router.py
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth
from cloudinary_config import upload_image

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user=Depends(auth.get_current_user)):
    """Return the logged-in user's profile"""
    return current_user

@router.post("/upload-profile", response_model=schemas.UserOut)
def upload_profile(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    """Upload profile image to Cloudinary, save URL in DB"""
    image_url = upload_image(file.file)  # Send file to Cloudinary
    current_user.profile_image_url = image_url
    db.commit()
    db.refresh(current_user)
    return current_user