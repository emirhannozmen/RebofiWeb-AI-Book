from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.auth import UserCreate, UserLogin, Token, UserResponse
from app.services import auth_service
from app.utils.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await auth_service.register_user(db, user)

@router.post("/login", response_model=Token)
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    return await auth_service.login_user(db, user)

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
