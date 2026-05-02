#!/usr/bin/env python3
"""
Database initialization script.
Creates all tables defined in the models.
"""
from app.database import engine
from app.models import Base

def init_db():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully")

if __name__ == "__main__":
    init_db()
