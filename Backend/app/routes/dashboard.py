from fastapi import APIRouter, Depends
from app.schemas.user import UserResponse
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("/dashboard", response_model=UserResponse)
def get_dashboard(current_user: dict = Depends(get_current_user)):
    return {
        "first_name": current_user["first_name"],
        "pets": []  # empty list, since pets table not implemented yet
    }
