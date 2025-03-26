# database.py
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))  # 添加父目录到系统路径
from sqlmodel import create_engine, SQLModel
from typing import Generator
from fastapi import Depends
from sqlmodel import Session
from urllib.parse import quote

DB_USERNAME = "tboostai_intern"
DB_PASSWORD = quote("K9#mPx$2vLq8")
DB_HOST = "tboostai-core-db.mysql.database.azure.com:3306"
DB_NAME = "tboostai_chat_db"

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

create_db_and_tables()