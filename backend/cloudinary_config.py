# backend/cloudinary_config.py
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

def upload_image(file) -> str:
    """Upload an image file to Cloudinary and return the URL"""
    result = cloudinary.uploader.upload(file, folder="quickbite")
    return result["secure_url"]  # HTTPS URL of the uploaded image