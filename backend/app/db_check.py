import asyncio
import logging
import sys
import time
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init_db():
    retries = 30  # Wait up to 30 seconds
    for i in range(retries):
        try:
            logger.info(f"Connecting to database (Attempt {i+1}/{retries})...")
            engine = create_async_engine(settings.DATABASE_URL)
            async with engine.begin() as conn:
                await conn.execute(text("SELECT 1"))
            logger.info("Database connection successful.")
            return
        except Exception as e:
            logger.warning(f"Database connection failed: {e}. Retrying in 1 second...")
            await asyncio.sleep(1)
    
    logger.error("Could not connect to database after multiple attempts.")
    sys.exit(1)

if __name__ == "__main__":
    asyncio.run(init_db())