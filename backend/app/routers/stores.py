from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import shopify
from pydantic import BaseModel

from ..database import get_db
from ..models import User, Store, Product, Policy
from ..auth.utils import get_current_user

router = APIRouter()

# Pydantic models for request/response
class ConnectStoreRequest(BaseModel):
    shop_domain: str
    api_key: str
    api_secret: str
    access_token: str

class StoreResponse(BaseModel):
    id: int
    shop_domain: str
    is_connected: bool
    created_at: str

class ProductResponse(BaseModel):
    id: int
    shopify_id: str
    title: str
    handle: str
    description: Optional[str]
    product_type: Optional[str]
    vendor: Optional[str]
    tags: List[str]
    status: str
    variants: List[dict]
    images: List[dict]

class PolicyResponse(BaseModel):
    id: int
    policy_type: str
    title: str
    body: str
    url: Optional[str]

def initialize_shopify_session(store: Store):
    """Initialize Shopify API session"""
    shopify.ShopifyResource.set_site(f"https://{store.api_key}:{store.access_token}@{store.shop_domain}/admin/api/2023-10")

@router.post("/connect", response_model=StoreResponse)
async def connect_store(
    request: ConnectStoreRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Connect a Shopify store using API credentials"""
    try:
        # Check if store already exists for this user
        existing_store = db.query(Store).filter(
            Store.user_id == current_user.id,
            Store.shop_domain == request.shop_domain
        ).first()

        if existing_store:
            # Update existing store
            existing_store.api_key = request.api_key
            existing_store.api_secret = request.api_secret
            existing_store.access_token = request.access_token
            existing_store.is_connected = True
            db.commit()
            db.refresh(existing_store)
            return StoreResponse(
                id=existing_store.id,
                shop_domain=existing_store.shop_domain,
                is_connected=existing_store.is_connected,
                created_at=existing_store.created_at.isoformat()
            )

        # Create new store connection
        new_store = Store(
            user_id=current_user.id,
            shop_domain=request.shop_domain,
            api_key=request.api_key,
            api_secret=request.api_secret,
            access_token=request.access_token,
            is_connected=True
        )

        db.add(new_store)
        db.commit()
        db.refresh(new_store)

        return StoreResponse(
            id=new_store.id,
            shop_domain=new_store.shop_domain,
            is_connected=new_store.is_connected,
            created_at=new_store.created_at.isoformat()
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to connect store: {str(e)}"
        )

@router.get("/", response_model=List[StoreResponse])
async def get_stores(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all connected stores for the current user"""
    stores = db.query(Store).filter(Store.user_id == current_user.id).all()
    return [
        StoreResponse(
            id=store.id,
            shop_domain=store.shop_domain,
            is_connected=store.is_connected,
            created_at=store.created_at.isoformat()
        )
        for store in stores
    ]

@router.post("/{store_id}/sync")
async def sync_store_data(
    store_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Sync products and policies from Shopify"""
    store = db.query(Store).filter(
        Store.id == store_id,
        Store.user_id == current_user.id
    ).first()

    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found"
        )

    try:
        initialize_shopify_session(store)

        # Sync products
        products_synced = 0
        shopify_products = shopify.Product.find(limit=250)
        for shopify_product in shopify_products:
            # Check if product already exists
            existing_product = db.query(Product).filter(
                Product.store_id == store_id,
                Product.shopify_id == str(shopify_product.id)
            ).first()

            product_data = {
                'store_id': store_id,
                'shopify_id': str(shopify_product.id),
                'title': shopify_product.title,
                'handle': shopify_product.handle,
                'description': shopify_product.body_html,
                'product_type': shopify_product.product_type,
                'vendor': shopify_product.vendor,
                'tags': shopify_product.tags,
                'status': shopify_product.status,
                'variants': [variant.to_dict() for variant in shopify_product.variants],
                'images': [image.to_dict() for image in shopify_product.images],
                'created_at_shopify': shopify_product.created_at,
                'updated_at_shopify': shopify_product.updated_at,
            }

            if existing_product:
                # Update existing product
                for key, value in product_data.items():
                    setattr(existing_product, key, value)
            else:
                # Create new product
                new_product = Product(**product_data)
                db.add(new_product)

            products_synced += 1

        # Sync policies
        policies_synced = 0
        shop = shopify.Shop.current()

        policy_types = [
            ('refund_policy', shop.refund_policy),
            ('privacy_policy', shop.privacy_policy),
            ('terms_of_service', shop.terms_of_service),
        ]

        for policy_type, policy_data in policy_types:
            if policy_data:
                # Check if policy already exists
                existing_policy = db.query(Policy).filter(
                    Policy.store_id == store_id,
                    Policy.policy_type == policy_type
                ).first()

                policy_info = {
                    'store_id': store_id,
                    'policy_type': policy_type,
                    'title': policy_data.get('title', ''),
                    'body': policy_data.get('body', ''),
                    'url': policy_data.get('url'),
                }

                if existing_policy:
                    # Update existing policy
                    for key, value in policy_info.items():
                        setattr(existing_policy, key, value)
                else:
                    # Create new policy
                    new_policy = Policy(**policy_info)
                    db.add(new_policy)

                policies_synced += 1

        db.commit()

        return {
            "message": "Store data synced successfully",
            "products_synced": products_synced,
            "policies_synced": policies_synced
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sync store data: {str(e)}"
        )

@router.get("/{store_id}/products", response_model=List[ProductResponse])
async def get_store_products(
    store_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all products for a store"""
    store = db.query(Store).filter(
        Store.id == store_id,
        Store.user_id == current_user.id
    ).first()

    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found"
        )

    products = db.query(Product).filter(Product.store_id == store_id).all()
    return [
        ProductResponse(
            id=product.id,
            shopify_id=product.shopify_id,
            title=product.title,
            handle=product.handle,
            description=product.description,
            product_type=product.product_type,
            vendor=product.vendor,
            tags=product.tags or [],
            status=product.status,
            variants=product.variants or [],
            images=product.images or []
        )
        for product in products
    ]

@router.get("/{store_id}/policies", response_model=List[PolicyResponse])
async def get_store_policies(
    store_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all policies for a store"""
    store = db.query(Store).filter(
        Store.id == store_id,
        Store.user_id == current_user.id
    ).first()

    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found"
        )

    policies = db.query(Policy).filter(Policy.store_id == store_id).all()
    return [
        PolicyResponse(
            id=policy.id,
            policy_type=policy.policy_type,
            title=policy.title,
            body=policy.body,
            url=policy.url
        )
        for policy in policies
    ]

@router.delete("/{store_id}")
async def disconnect_store(
    store_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Disconnect a store"""
    store = db.query(Store).filter(
        Store.id == store_id,
        Store.user_id == current_user.id
    ).first()

    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found"
        )

    db.delete(store)
    db.commit()

    return {"message": "Store disconnected successfully"}