from pydantic import BaseModel
from typing import Optional

class MessageLimitCheckRequest(BaseModel):
    session_id: str

class MessageLimitCheckResponse(BaseModel):
    need_login: bool
    message: str = ""

class MessageLimitCheckResult(BaseModel):
    """Internal schema for message limit check result"""
    need_login: bool
    message: Optional[str] = None

class MessageLimitResponse(BaseModel):
    """Response schema for message limit check"""
    need_login: bool
    message: Optional[str] = None
    status_code: int = 200  # 添加状态码字段 