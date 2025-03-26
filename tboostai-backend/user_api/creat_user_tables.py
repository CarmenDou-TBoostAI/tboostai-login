# create_tables.py

from sqlmodel import SQLModel, create_engine

import pymysql
import logging
from user_models import UserAccount, VerificationCode, GoogleAuthRequest, EmailVerificationRequest
from urllib.parse import quote

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_USERNAME = "tboostai_intern"
DB_PASSWORD = quote("K9#mPx$2vLq8")
DB_HOST = "tboostai-core-db.mysql.database.azure.com:3306"
DB_NAME = "tboostai_user_db"


def create_tables():
    try:
        
        # Now connect with database name and create tables
        DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
        engine = create_engine(DATABASE_URL, echo=True)
        
        # Create all tables
        SQLModel.metadata.create_all(engine)
        logger.info("All tables created successfully")
        
    except Exception as e:
        logger.error(f"Error creating tables: {e}")
        raise

if __name__ == "__main__":
    create_tables()