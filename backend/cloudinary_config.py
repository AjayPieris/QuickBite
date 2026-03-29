# backend/cloudinary_config.py
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("Cloudinary__CloudName"),
    api_key=os.getenv("Cloudinary__ApiKey"),
    api_secret=os.getenv("Cloudinary__ApiSecret"),
)

def upload_image(file) -> str:
    """Upload an image file to Cloudinary and return the URL"""
    result = cloudinary.uploader.upload(file, folder="quickbite")
    return result["secure_url"]  # HTTPS URL of the uploaded image