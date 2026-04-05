from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin
from app.utils.security import get_password_hash, verify_password, create_access_token
from app.utils.exceptions import EmailAlreadyExistsException, CredentialsException

async def register_user(db: AsyncSession, user: UserCreate):
    result = await db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise EmailAlreadyExistsException()

    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        name=user.name,
        password_hash=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    access_token = create_access_token(subject=db_user.user_id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

async def login_user(db: AsyncSession, user_credentials: UserLogin):
    result = await db.execute(select(User).where(User.email == user_credentials.email))
    user = result.scalars().first()
    
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise CredentialsException()
        
    access_token = create_access_token(subject=user.user_id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

async def get_user_by_id(db: AsyncSession, user_id: str):
    result = await db.execute(select(User).where(User.user_id == user_id))
    return result.scalars().first()
