# backend/routers/order_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("", response_model=list[schemas.OrderOut])
@router.get("/", response_model=list[schemas.OrderOut])
def get_all_orders(db: Session = Depends(get_db), admin=Depends(auth.require_admin)):
    """Admin gets all orders"""
    return db.query(models.Order).all()

@router.post("/", response_model=schemas.OrderOut)
def place_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db), current_user=Depends(auth.get_current_user)):
    # Calculate total price
    total = 0
    for item in order_data.items:
        menu_item = db.query(models.MenuItem).filter(models.MenuItem.id == item.menu_id).first()
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item {item.menu_id} not found")
        total += menu_item.price * item.quantity

    # Create the order
    new_order = models.Order(
        user_id=current_user.id,
        total_price=total,
        pickup_time=order_data.pickup_time,
        status="pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Add each item to order_items table
    for item in order_data.items:
        order_item = models.OrderItem(order_id=new_order.id, menu_id=item.menu_id, quantity=item.quantity)
        db.add(order_item)
    db.commit()
    return new_order

@router.get("/my", response_model=list[schemas.OrderOut])
def my_orders(db: Session = Depends(get_db), current_user=Depends(auth.get_current_user)):
    """Get all orders for the logged-in user"""
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).all()

@router.put("/{order_id}/status")
def update_status(order_id: int, status: str, db: Session = Depends(get_db), admin=Depends(auth.require_admin)):
    """Admin updates order status"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if status not in ["pending", "preparing", "ready"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    order.status = status
    db.commit()
    return {"message": f"Order {order_id} status updated to {status}"}