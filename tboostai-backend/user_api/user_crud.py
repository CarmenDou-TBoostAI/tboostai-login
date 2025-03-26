from sqlmodel import Session, select
from user_models import UserAccount, VerificationCode
from datetime import datetime, timedelta
import uuid
from typing import Optional
from fastapi import HTTPException
import requests
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))
from config import config



DEFAULT_AVATAR_URL = ""
async def get_user_by_email(db: Session, email: str) -> Optional[UserAccount]:
    return db.exec(select(UserAccount).where(UserAccount.email == email)).first()

async def create_user(
    db: Session,
    email: str,
    provider_user_id: Optional[str] = None,
    full_name: Optional[str] = None,
    avatar_url: Optional[str] = DEFAULT_AVATAR_URL,
) -> UserAccount:
    user = UserAccount(
        id=str(uuid.uuid4()),
        email=email,
        provider_user_id=provider_user_id,
        full_name=full_name,
        avatar_url=avatar_url,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 调用 create_chat_session
    try:
        response = requests.post(
            f"{config.CHAT_BACKEND_URL}/sessions/",
            json={
                "user_id": user.id,
                "title": user.email
            }
        )
        response.raise_for_status()
    except Exception as e:
        print(f"Failed to create chat session: {e}")
    
    return user

async def save_verification_code(db: Session, email: str, code: str) -> VerificationCode:
    verification = VerificationCode(
        id=str(uuid.uuid4()),
        email=email,
        code=code,
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.add(verification)
    db.commit()
    return verification

async def verify_code(db: Session, email: str, code: str) -> bool:
    verification = db.exec(
        select(VerificationCode)
        .where(
            VerificationCode.email == email,
            VerificationCode.code == code,
            VerificationCode.is_used == False,
            VerificationCode.expires_at > datetime.utcnow()
        )
    ).first()
    
    if not verification:
        all_codes = db.exec(
            select(VerificationCode)
            .where(VerificationCode.email == email)
            .order_by(VerificationCode.created_at.desc())
        ).first()
        
        if all_codes:
            if all_codes.is_used:
                print(f"Code {code} for {email} has already been used")
            elif all_codes.expires_at <= datetime.utcnow():
                print(f"Code {code} for {email} has expired")
            else:
                print(f"Invalid code {code} for {email}")
        else:
            print(f"No verification code found for {email}")
        return False
        
    verification.is_used = True
    db.commit()
    return True, "Verification successful"