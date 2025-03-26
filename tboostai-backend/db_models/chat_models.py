# chat_models.py
from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum as PyEnum
from sqlalchemy import Column, Text, JSON

class ChatSessionStatus(str, PyEnum):
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"



class UserChatSession(SQLModel, table=True):
    __tablename__ = "user_chat_sessions"
    
    id: str = Field(primary_key=True)
    user_id: Optional[str] = Field(default=None, index=True, nullable=True)  # Made optional
    status: ChatSessionStatus = Field(default=ChatSessionStatus.ACTIVE)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_message_at: datetime = Field(default_factory=datetime.utcnow)
    total_messages: int = Field(default=0)
    title: Optional[str] = Field(default=None, max_length=200)
    
    # Relationships
    messages: List["ChatMessage"] = Relationship(back_populates="chat_session")

class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"
    
    id: str = Field(primary_key=True)
    chat_session_id: str = Field(foreign_key="user_chat_sessions.id", index=True)
    user_id: Optional[str] = Field(default=None, index=True, nullable=True) 
    role: str = Field(max_length=20)  # 'user' or 'assistant'
    content: str = Field(sa_column=Column(Text))
    agent_content: str = Field(sa_column=Column(Text))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    tokens: Optional[int] = Field(default=None)
    options: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    
    # Relationship
    chat_session: UserChatSession = Relationship(back_populates="messages")

