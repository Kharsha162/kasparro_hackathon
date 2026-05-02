from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    shop_domain = Column(String, unique=True, index=True, nullable=False)
    access_token = Column(String, nullable=False)
    api_key = Column(String, nullable=False)
    api_secret = Column(String, nullable=False)
    is_connected = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="stores")
    products = relationship("Product", back_populates="store", cascade="all, delete-orphan")
    policies = relationship("Policy", back_populates="store", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    shopify_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    handle = Column(String, nullable=False)
    description = Column(Text)
    product_type = Column(String)
    vendor = Column(String)
    tags = Column(JSON)  # Store as JSON array
    variants = Column(JSON)  # Store variant data as JSON
    images = Column(JSON)  # Store image URLs as JSON
    status = Column(String, default="active")
    created_at_shopify = Column(DateTime(timezone=True))
    updated_at_shopify = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    store = relationship("Store", back_populates="products")

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    policy_type = Column(String, nullable=False)  # refund_policy, privacy_policy, terms_of_service, etc.
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    url = Column(String)  # URL to the policy page
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    store = relationship("Store", back_populates="policies")