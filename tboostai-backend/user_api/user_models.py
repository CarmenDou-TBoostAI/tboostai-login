# user_models.py
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timedelta
import uuid
from enum import Enum as PyEnum
from sqlalchemy import Column, Text, Index, JSON

class AccountStatus(str, PyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class UserAccount(SQLModel, table=True):
    __tablename__ = "user_accounts"
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    # hashed_password: str
    full_name: Optional[str] = Field(default=None)  # 允许为 None
    avatar_url: Optional[str] = Field(default=None)
    phone_number: Optional[str] = None
    provider_user_id: Optional[str] = None  # Google's ID，如果存在则是 Google 登录

    status: AccountStatus = Field(default=AccountStatus.ACTIVE)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

    # OAuth 相关字段
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    
class VerificationCode(SQLModel, table=True):
    __tablename__ = "verification_codes"
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(index=True)  # 索引加快查询速度
    code: str  # 6位验证码
    purpose: str = Field(default="login")  # 用途：login, reset_password 等
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime = Field(  # 10分钟后过期
        default_factory=lambda: datetime.utcnow() + timedelta(minutes=10)
    )
    is_used: bool = Field(default=False)  
    attempts: int = Field(default=0)  
    
    class Config:
        # 创建复合索引
        table_args = (
            {"mysql_engine": "InnoDB"},  
            {"mysql_charset": "utf8mb4"}  
        )

class GoogleAuthRequest(BaseModel):
    idToken: str

# 用于接收邮箱验证码请求的模型
class EmailVerificationRequest(BaseModel):
    email: str

class CompleteProfileRequest(BaseModel):
    email: str
    full_name: str

class EmailCodeVerificationRequest(BaseModel):
    email: str
    code: str

class EmailUserCreateRequest(BaseModel):
    email: str
    