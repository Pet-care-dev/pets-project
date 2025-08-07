from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user import UserCreate, UserLogin
from app.utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from app.database import users_collection


router = APIRouter()


@router.post("/register")
def register(user: UserCreate):
    # Check if user with same email already exists
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password before storing
    hashed = hash_password(user.password)
    new_user = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "password": hashed,
    }
    # Insert new user document in MongoDB
    users_collection.insert_one(new_user)
    
    return {"message": "User registered successfully"}


@router.post("/login")
def login(user: UserLogin): 
    # Find user by email
    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token with user email as subject
    token = create_access_token({"sub": user.email})
    
    return {"access_token": token, "token_type": "bearer"}


@router.get("/dashboard")
def get_dashboard(current_user=Depends(get_current_user)):
    return {"message": f"Welcome {current_user['first_name']}!"}

