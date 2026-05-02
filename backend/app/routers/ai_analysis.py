from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import json
from datetime import datetime
from groq import Groq
from openai import OpenAI
from pydantic import BaseModel

from ..database import get_db
from ..models import Product
from ..auth.utils import get_current_user

router = APIRouter()

# Initialize AI clients
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Pydantic models
class ShadowShopperRequest(BaseModel):
    product_id: int
    query: str = "Is this product worth buying?"

class PersonaAnalysis(BaseModel):
    persona: str
    decision: str  # "recommend", "not_recommend", "neutral"
    reasoning: str
    confidence: float  # 0.0 to 1.0
    missing_info: List[str]

class ShadowShopperResponse(BaseModel):
    product_id: int
    product_title: str
    query: str
    analyses: List[PersonaAnalysis]

class TimelineStep(BaseModel):
    step_number: int
    action: str
    title: str
    description: str
    reasoning: str
    missing_info: List[str]
    confidence: float
    timestamp: str

class ReplayAnalysisResponse(BaseModel):
    product_id: int
    product_title: str
    query: str
    persona: str
    timeline: List[TimelineStep]
    final_decision: str
    overall_confidence: float

# OpenAI Analysis Engine Models
class AnalysisInsight(BaseModel):
    mismatches: List[str]
    missing_data: List[str]
    impact_level: str  # "low", "medium", "high", "critical"

class PerceptionRealityAnalysis(BaseModel):
    title: str
    description: str
    insight: AnalysisInsight
    recommendations: List[str]

class ConversionKillSwitch(BaseModel):
    title: str
    description: str
    trigger_points: List[str]
    impact_level: str
    mitigation_steps: List[str]

class IntentCoverageAnalysis(BaseModel):
    title: str
    description: str
    coverage_score: float  # 0.0 to 1.0
    gaps: List[str]
    recommendations: List[str]

class StoreAnalysisRequest(BaseModel):
    store_id: Optional[int] = None  # Optional store filtering

class StoreAnalysisResponse(BaseModel):
    perception_reality: List[PerceptionRealityAnalysis]
    conversion_kill_switches: List[ConversionKillSwitch]
    intent_coverage: IntentCoverageAnalysis
    overall_score: float
    generated_at: str

# AI Trust Score Models
class TrustScoreBreakdown(BaseModel):
    clarity: float  # 0.0 to 1.0
    completeness: float  # 0.0 to 1.0
    trust_signals: float  # 0.0 to 1.0
    consistency: float  # 0.0 to 1.0

class TrustScoreReason(BaseModel):
    factor: str  # "clarity", "completeness", "trust_signals", "consistency"
    score: float
    explanation: str
    recommendations: List[str]

class TrustScoreResponse(BaseModel):
    overall_score: float  # 0 to 100
    breakdown: TrustScoreBreakdown
    reasons: List[TrustScoreReason]
    generated_at: str

# Auto-Fix Engine Models
class ProductSpec(BaseModel):
    name: str
    value: str
    category: str  # "dimensions", "materials", "features", "technical", "other"

class FAQItem(BaseModel):
    question: str
    answer: str
    category: str  # "usage", "specifications", "shipping", "returns", "compatibility"

class AutoFixRequest(BaseModel):
    product_id: int

class AutoFixResponse(BaseModel):
    product_id: int
    original_description: str
    improved_description: str
    generated_faqs: List[FAQItem]
    structured_specs: List[ProductSpec]
    improvements_made: List[str]
    generated_at: str

# Define AI personas
PERSONAS = {
    "budget_shopper": {
        "name": "Budget Shopper",
        "description": """You are a cost-conscious shopper who prioritizes value for money.
        You focus on price, practicality, and getting the most bang for your buck.
        You're skeptical of premium pricing and look for deals and practical benefits.""",
        "decision_criteria": "Focus on price-to-value ratio, practicality, and cost savings."
    },
    "premium_buyer": {
        "name": "Premium Buyer",
        "description": """You are a quality-focused shopper who values premium experiences and products.
        You prioritize brand reputation, quality materials, luxury features, and status.
        You're willing to pay more for superior quality and exclusive benefits.""",
        "decision_criteria": "Focus on quality, brand prestige, luxury features, and long-term value."
    },
    "skeptical_user": {
        "name": "Skeptical User",
        "description": """You are a cautious shopper who questions everything and looks for potential issues.
        You focus on reviews, potential problems, hidden costs, and realistic expectations.
        You're concerned about scams, quality issues, and whether the product lives up to its claims.""",
        "decision_criteria": "Focus on potential issues, reviews, hidden costs, and realistic assessment."
    }
}

def analyze_product_with_persona(product: Product, query: str, persona_key: str) -> PersonaAnalysis:
    """Analyze a product using a specific AI persona"""

    persona = PERSONAS[persona_key]

    # Prepare product information for AI
    product_info = f"""
Product Title: {product.title}
Description: {product.description or 'No description available'}
Product Type: {product.product_type or 'N/A'}
Vendor: {product.vendor or 'N/A'}
Tags: {', '.join(product.tags) if product.tags else 'None'}
Status: {product.status}

Variants: {len(product.variants) if product.variants else 0} variants available
Images: {len(product.images) if product.images else 0} images available
"""

    # Create the AI prompt
    prompt = f"""
You are role-playing as a {persona['name']}.

{persona['description']}

{persona['decision_criteria']}

Product Information:
{product_info}

User Query: {query}

Please analyze this product and answer the query from your persona's perspective.

Return your response as a JSON object with exactly these fields:
- decision: "recommend", "not_recommend", or "neutral"
- reasoning: A detailed explanation of your thought process and decision
- confidence: A number between 0.0 and 1.0 indicating how confident you are in your assessment
- missing_info: An array of strings listing any information you'd need to make a better decision

Be honest and stay in character. Consider the product's features, pricing context, and practical implications.
"""

    try:
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are an AI assistant that responds only with valid JSON objects. No additional text or formatting."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        # Parse the JSON response
        import json
        result = json.loads(response.choices[0].message.content.strip())

        return PersonaAnalysis(
            persona=persona['name'],
            decision=result.get('decision', 'neutral'),
            reasoning=result.get('reasoning', 'Unable to analyze'),
            confidence=min(max(float(result.get('confidence', 0.5)), 0.0), 1.0),
            missing_info=result.get('missing_info', [])
        )

    except Exception as e:
        # Fallback response in case of API error
        return PersonaAnalysis(
            persona=persona['name'],
            decision="neutral",
            reasoning=f"Unable to complete analysis due to technical issues: {str(e)}",
            confidence=0.0,
            missing_info=["API connection failed", "Unable to process product data"]
        )

def create_timeline_analysis(product: Product, query: str, persona_key: str) -> ReplayAnalysisResponse:
    """Create a step-by-step timeline analysis of AI decision making"""

    persona = PERSONAS[persona_key]

    # Prepare product information
    product_info = f"""
Product Title: {product.title}
Description: {product.description or 'No description available'}
Product Type: {product.product_type or 'N/A'}
Vendor: {product.vendor or 'N/A'}
Tags: {', '.join(product.tags) if product.tags else 'None'}
Status: {product.status}
Variants: {len(product.variants) if product.variants else 0} variants available
Images: {len(product.images) if product.images else 0} images available
"""

    # Create detailed timeline prompt
    timeline_prompt = f"""
You are role-playing as a {persona['name']}.

{persona['description']}

{persona['decision_criteria']}

Product Information:
{product_info}

User Query: {query}

Think step-by-step like a human shopper would, and break down your analysis into exactly 4 chronological steps:

1. "Read product" - Initial product examination and first impressions
2. "Evaluate query" - Understanding what the user is asking and why
3. "Confusion" - Identifying uncertainties, missing information, or conflicting data
4. "Drop" - Final decision with confidence level

For each step, provide:
- action: The step name (exactly: "Read product", "Evaluate query", "Confusion", "Drop")
- title: A brief title for this step
- description: What you're thinking/feeling at this moment
- reasoning: Your logical thought process
- missing_info: Array of information gaps you notice
- confidence: Number 0.0-1.0 showing certainty level

Return your response as a JSON object with:
- timeline: Array of 4 step objects with the fields above
- final_decision: "recommend", "not_recommend", or "neutral"
- overall_confidence: Overall confidence in final decision (0.0-1.0)
"""

    try:
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are an AI assistant that responds only with valid JSON objects. Create realistic step-by-step shopper analysis."},
                {"role": "user", "content": timeline_prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )

        import json
        result = json.loads(response.choices[0].message.content.strip())

        # Build timeline with timestamps
        timeline = []
        base_time = 0
        for i, step_data in enumerate(result.get('timeline', [])):
            step = TimelineStep(
                step_number=i + 1,
                action=step_data.get('action', f'Step {i+1}'),
                title=step_data.get('title', f'Step {i+1}'),
                description=step_data.get('description', ''),
                reasoning=step_data.get('reasoning', ''),
                missing_info=step_data.get('missing_info', []),
                confidence=min(max(float(step_data.get('confidence', 0.5)), 0.0), 1.0),
                timestamp=f"00:00:{base_time:02d}"
            )
            timeline.append(step)
            base_time += 5 + (i * 3)  # Progressive timing

        return ReplayAnalysisResponse(
            product_id=product.id,
            product_title=product.title,
            query=query,
            persona=persona['name'],
            timeline=timeline,
            final_decision=result.get('final_decision', 'neutral'),
            overall_confidence=min(max(float(result.get('overall_confidence', 0.5)), 0.0), 1.0)
        )

    except Exception as e:
        # Create fallback timeline
        fallback_timeline = [
            TimelineStep(
                step_number=1,
                action="Read product",
                title="Initial Product Review",
                description="Examining the basic product information",
                reasoning="Starting with the fundamental product details",
                missing_info=["Price information", "Customer reviews"],
                confidence=0.3,
                timestamp="00:00:00"
            ),
            TimelineStep(
                step_number=2,
                action="Evaluate query",
                title="Understanding the Question",
                description="Processing what the user is asking",
                reasoning="The query seems to be about product value",
                missing_info=["User's budget constraints", "Specific requirements"],
                confidence=0.4,
                timestamp="00:00:08"
            ),
            TimelineStep(
                step_number=3,
                action="Confusion",
                title="Identifying Gaps",
                description="Noticing missing critical information",
                reasoning="Several key details are missing for a proper evaluation",
                missing_info=["Detailed specifications", "Price comparison", "Return policy"],
                confidence=0.2,
                timestamp="00:00:15"
            ),
            TimelineStep(
                step_number=4,
                action="Drop",
                title="Final Assessment",
                description="Making a decision based on available information",
                reasoning=f"Unable to complete analysis due to technical issues: {str(e)}",
                missing_info=["API connection failed", "Unable to process complete analysis"],
                confidence=0.0,
                timestamp="00:00:22"
            )
        ]

        return ReplayAnalysisResponse(
            product_id=product.id,
            product_title=product.title,
            query=query,
            persona=persona['name'],
            timeline=fallback_timeline,
            final_decision="neutral",
            overall_confidence=0.0
        )

@router.post("/shadow-shopper", response_model=ShadowShopperResponse)
async def run_shadow_shopper(
    request: ShadowShopperRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Run AI Shadow Shopper analysis on a product using multiple personas"""

    # Get the product from database
    product = db.query(Product).filter(Product.id == request.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Run analysis for each persona
    analyses = []
    for persona_key in PERSONAS.keys():
        analysis = analyze_product_with_persona(product, request.query, persona_key)
        analyses.append(analysis)

    return ShadowShopperResponse(
        product_id=product.id,
        product_title=product.title,
        query=request.query,
        analyses=analyses
    )

@router.post("/replay-timeline", response_model=ReplayAnalysisResponse)
async def create_replay_timeline(
    request: ShadowShopperRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a step-by-step timeline analysis for replay mode"""

    # Get the product from database
    product = db.query(Product).filter(Product.id == request.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Use the first persona for timeline (can be extended to choose persona)
    persona_key = list(PERSONAS.keys())[0]  # Default to budget_shopper

    return create_timeline_analysis(product, request.query, persona_key)

def analyze_perception_vs_reality(products: List[Product]) -> List[PerceptionRealityAnalysis]:
    """Analyze perception vs reality mismatches using OpenAI"""

    # Prepare store data for analysis
    store_data = "\n".join([
        f"Product: {p.title}\nDescription: {p.description or 'No description'}\nTags: {', '.join(p.tags) if p.tags else 'None'}\n"
        for p in products[:10]  # Limit to first 10 products for analysis
    ])

    prompt = f"""
Analyze this e-commerce store's products for perception vs reality mismatches.

Store Products:
{store_data}

Identify 3-5 key areas where customer perceptions might differ from reality:

1. **Product Quality vs Marketing Claims**
2. **Pricing Expectations vs Actual Costs**
3. **Delivery Time vs Promised Timelines**
4. **Product Features vs Actual Capabilities**
5. **Customer Service vs Actual Support**

For each mismatch, provide:
- title: Brief description of the mismatch
- description: Detailed explanation
- insight: Object with mismatches[], missing_data[], impact_level ("low"/"medium"/"high"/"critical")
- recommendations: Array of actionable improvements

Return as JSON array of analysis objects.
"""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert e-commerce analyst. Return only valid JSON arrays."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=2000
        )

        import json
        result = json.loads(response.choices[0].message.content.strip())
        return [PerceptionRealityAnalysis(**item) for item in result]

    except Exception as e:
        # Fallback analysis
        return [
            PerceptionRealityAnalysis(
                title="Product Descriptions vs Reality",
                description="Marketing claims may not match actual product capabilities",
                insight=AnalysisInsight(
                    mismatches=["Overstated feature benefits", "Unrealistic performance claims"],
                    missing_data=["Customer reviews", "Independent testing results"],
                    impact_level="high"
                ),
                recommendations=["Add customer testimonials", "Include third-party reviews", "Clarify product limitations"]
            )
        ]

def detect_conversion_kill_switches(products: List[Product]) -> List[ConversionKillSwitch]:
    """Detect conversion barriers using OpenAI"""

    store_data = "\n".join([
        f"Product: {p.title}\nPrice: {getattr(p, 'price', 'N/A')}\nDescription: {p.description or 'No description'}\n"
        for p in products[:10]
    ])

    prompt = f"""
Analyze this e-commerce store for conversion kill switches - factors that prevent purchases.

Store Products:
{store_data}

Identify critical conversion barriers:

1. **Trust Issues** - Lack of credibility signals
2. **Price Concerns** - Pricing that seems unreasonable
3. **Clarity Problems** - Unclear product information
4. **Friction Points** - Complicated purchase process
5. **Risk Perception** - High perceived purchase risk

For each kill switch, provide:
- title: Name of the conversion barrier
- description: Why it's a problem
- trigger_points: Array of specific issues
- impact_level: "low"/"medium"/"high"/"critical"
- mitigation_steps: Array of solutions

Return as JSON array.
"""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a conversion rate optimization expert. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=2000
        )

        import json
        result = json.loads(response.choices[0].message.content.strip())
        return [ConversionKillSwitch(**item) for item in result]

    except Exception as e:
        return [
            ConversionKillSwitch(
                title="Trust Signals Missing",
                description="Lack of credibility indicators preventing purchases",
                trigger_points=["No customer reviews", "No security badges", "Unprofessional design"],
                impact_level="critical",
                mitigation_steps=["Add customer testimonials", "Include trust badges", "Improve site design"]
            )
        ]

def analyze_intent_coverage(products: List[Product]) -> IntentCoverageAnalysis:
    """Analyze how well the store covers customer intents using OpenAI"""

    store_data = "\n".join([
        f"Product: {p.title}\nType: {p.product_type or 'N/A'}\nTags: {', '.join(p.tags) if p.tags else 'None'}\n"
        for p in products
    ])

    prompt = f"""
Analyze this e-commerce store's coverage of customer shopping intents.

Store Products:
{store_data}

Evaluate coverage of these customer intents:
1. **Problem Solving** - Products that solve specific problems
2. **Aspirational Purchases** - Luxury or status items
3. **Practical Needs** - Everyday essentials
4. **Gift Shopping** - Items suitable for gifting
5. **Bulk/Wholesale** - Quantity discounts
6. **Comparison Shopping** - Easy price/feature comparison

Calculate coverage score (0.0-1.0) and identify gaps.

Return JSON object with:
- title: "Intent Coverage Analysis"
- description: Summary of coverage
- coverage_score: Number 0.0-1.0
- gaps: Array of missing intent categories
- recommendations: Array of improvement suggestions
"""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a customer intent analysis expert. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1500
        )

        import json
        result = json.loads(response.choices[0].message.content.strip())
        return IntentCoverageAnalysis(**result)

    except Exception as e:
        return IntentCoverageAnalysis(
            title="Intent Coverage Analysis",
            description="Analysis of how well the store serves different customer shopping intents",
            coverage_score=0.6,
            gaps=["Gift shopping options", "Bulk purchase discounts", "Comparison tools"],
            recommendations=["Add gift wrapping options", "Create bulk pricing tiers", "Implement comparison features"]
        )

def calculate_ai_trust_score(products: List[Product]) -> TrustScoreResponse:
    """Calculate AI Trust Score based on clarity, completeness, trust signals, and consistency"""

    if not products:
        return TrustScoreResponse(
            overall_score=0.0,
            breakdown=TrustScoreBreakdown(clarity=0.0, completeness=0.0, trust_signals=0.0, consistency=0.0),
            reasons=[],
            generated_at=datetime.now().isoformat()
        )

    # Prepare store data for analysis
    store_data = f"""
Store Analysis Data:
Total Products: {len(products)}

Product Details:
"""

    for i, product in enumerate(products[:10]):  # Analyze first 10 products for efficiency
        store_data += f"""
Product {i+1}: {product.title}
- Description: {product.description or 'No description'}
- Product Type: {product.product_type or 'N/A'}
- Vendor: {product.vendor or 'N/A'}
- Tags: {', '.join(product.tags) if product.tags else 'None'}
- Status: {product.status}
- Variants: {len(product.variants) if product.variants else 0}
- Images: {len(product.images) if product.images else 0}
"""

    prompt = f"""
Analyze this e-commerce store's trustworthiness based on the following factors:

1. CLARITY: How clear and understandable are product descriptions, titles, and information?
2. COMPLETENESS: How complete is the product information (descriptions, specs, images, variants)?
3. TRUST SIGNALS: What indicators of trustworthiness are present (vendor info, reviews, policies)?
4. CONSISTENCY: How consistent is the information quality and presentation across products?

Store Data:
{store_data}

Return your analysis as a JSON object with exactly this structure:
{{
  "clarity": {{
    "score": 0.0-1.0,
    "explanation": "Detailed explanation of clarity assessment",
    "recommendations": ["Specific recommendations to improve clarity"]
  }},
  "completeness": {{
    "score": 0.0-1.0,
    "explanation": "Detailed explanation of completeness assessment",
    "recommendations": ["Specific recommendations to improve completeness"]
  }},
  "trust_signals": {{
    "score": 0.0-1.0,
    "explanation": "Detailed explanation of trust signals assessment",
    "recommendations": ["Specific recommendations to improve trust signals"]
  }},
  "consistency": {{
    "score": 0.0-1.0,
    "explanation": "Detailed explanation of consistency assessment",
    "recommendations": ["Specific recommendations to improve consistency"]
  }}
}}

Be specific and provide actionable recommendations. Score each factor from 0.0 (very poor) to 1.0 (excellent).
"""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert e-commerce trust analyst. Provide detailed, actionable analysis."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=2000
        )

        result = json.loads(response.choices[0].message.content)

        # Calculate overall score (weighted average)
        weights = {"clarity": 0.25, "completeness": 0.30, "trust_signals": 0.25, "consistency": 0.20}
        overall_score = sum(result[factor]["score"] * weights[factor] for factor in weights.keys()) * 100

        # Create breakdown
        breakdown = TrustScoreBreakdown(
            clarity=result["clarity"]["score"],
            completeness=result["completeness"]["score"],
            trust_signals=result["trust_signals"]["score"],
            consistency=result["consistency"]["score"]
        )

        # Create reasons
        reasons = [
            TrustScoreReason(
                factor=factor,
                score=result[factor]["score"],
                explanation=result[factor]["explanation"],
                recommendations=result[factor]["recommendations"]
            )
            for factor in ["clarity", "completeness", "trust_signals", "consistency"]
        ]

        return TrustScoreResponse(
            overall_score=round(overall_score, 1),
            breakdown=breakdown,
            reasons=reasons,
            generated_at=datetime.now().isoformat()
        )

    except Exception as e:
        # Fallback response in case of API error
        return TrustScoreResponse(
            overall_score=50.0,
            breakdown=TrustScoreBreakdown(clarity=0.5, completeness=0.5, trust_signals=0.5, consistency=0.5),
            reasons=[
                TrustScoreReason(
                    factor="error",
                    score=0.5,
                    explanation=f"Analysis failed due to API error: {str(e)}",
                    recommendations=["Check API configuration", "Retry the analysis"]
                )
            ],
            generated_at=datetime.now().isoformat()
        )

@router.post("/store-analysis", response_model=StoreAnalysisResponse)
async def run_store_analysis(
    request: StoreAnalysisRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Run comprehensive store analysis using OpenAI"""

    # Get products from database
    query = db.query(Product)
    if request.store_id:
        # Assuming products have a store_id field - adjust based on your model
        query = query.filter(Product.store_id == request.store_id)

    products = query.limit(50).all()  # Limit for analysis

    if not products:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No products found for analysis"
        )

    # Run all three analyses
    perception_reality = analyze_perception_vs_reality(products)
    conversion_kill_switches = detect_conversion_kill_switches(products)
    intent_coverage = analyze_intent_coverage(products)

    # Calculate overall score
    kill_switch_impact = {
        "low": 0.1,
        "medium": 0.3,
        "high": 0.5,
        "critical": 0.8
    }

    avg_kill_switch_impact = sum(kill_switch_impact.get(ks.impact_level, 0.1) for ks in conversion_kill_switches) / len(conversion_kill_switches)
    overall_score = (intent_coverage.coverage_score + (1 - avg_kill_switch_impact)) / 2

    import datetime
    return StoreAnalysisResponse(
        perception_reality=perception_reality,
        conversion_kill_switches=conversion_kill_switches,
        intent_coverage=intent_coverage,
        overall_score=round(overall_score, 2),
        generated_at=datetime.datetime.utcnow().isoformat()
    )

@router.post("/trust-score", response_model=TrustScoreResponse)
async def get_trust_score(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Calculate AI Trust Score for the store"""
    products = db.query(Product).all()
    return calculate_ai_trust_score(products)

def auto_fix_product(product: Product) -> AutoFixResponse:
    """Use OpenAI to auto-fix and improve product data"""

    # Prepare product information for AI
    product_info = f"""
Product Title: {product.title}
Original Description: {product.description or 'No description available'}
Product Type: {product.product_type or 'N/A'}
Vendor: {product.vendor or 'N/A'}
Tags: {', '.join(product.tags) if product.tags else 'None'}
Status: {product.status}

Variants: {len(product.variants) if product.variants else 0} variants available
Images: {len(product.images) if product.images else 0} images available

Additional Data:
- Handle: {product.handle or 'N/A'}
- Published: {product.published_at or 'N/A'}
- Created: {product.created_at or 'N/A'}
- Updated: {product.updated_at or 'N/A'}
"""

    prompt = f"""
You are an expert e-commerce product optimizer. Analyze this product and create improved content.

Product Information:
{product_info}

Please provide improvements in the following JSON format:
{{
  "improved_description": "A comprehensive, SEO-optimized product description that highlights key features, benefits, and specifications. Make it engaging and persuasive while being accurate.",
  "generated_faqs": [
    {{
      "question": "Specific question about the product",
      "answer": "Detailed, helpful answer",
      "category": "usage|specifications|shipping|returns|compatibility"
    }}
  ],
  "structured_specs": [
    {{
      "name": "Specification name",
      "value": "Specification value",
      "category": "dimensions|materials|features|technical|other"
    }}
  ],
  "improvements_made": [
    "List of specific improvements made to the description",
    "SEO optimizations applied",
    "Clarity improvements",
    "Additional information added"
  ]
}}

Guidelines:
- improved_description: Should be 200-400 words, engaging, and conversion-focused
- generated_faqs: Create 5-8 relevant FAQs covering common customer questions
- structured_specs: Extract and organize all specifications from the product data
- improvements_made: List what was changed and why

Make the description more compelling, add missing information where logical, and ensure it's optimized for both customers and search engines.
"""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert e-commerce product content optimizer. Provide detailed, actionable improvements."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4,
            max_tokens=3000
        )

        result = json.loads(response.choices[0].message.content)

        return AutoFixResponse(
            product_id=product.id,
            original_description=product.description or "",
            improved_description=result["improved_description"],
            generated_faqs=[FAQItem(**faq) for faq in result["generated_faqs"]],
            structured_specs=[ProductSpec(**spec) for spec in result["structured_specs"]],
            improvements_made=result["improvements_made"],
            generated_at=datetime.now().isoformat()
        )

    except Exception as e:
        # Fallback response in case of API error
        return AutoFixResponse(
            product_id=product.id,
            original_description=product.description or "",
            improved_description=product.description or "Unable to generate improved description due to API error.",
            generated_faqs=[],
            structured_specs=[],
            improvements_made=[f"Analysis failed due to API error: {str(e)}"],
            generated_at=datetime.now().isoformat()
        )

@router.post("/analyze")
async def analyze_store():
    return {"message": "AI analysis"}

@router.post("/auto-fix", response_model=AutoFixResponse)
async def run_auto_fix(
    request: AutoFixRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Auto-fix product content using OpenAI"""
    product = db.query(Product).filter(Product.id == request.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return auto_fix_product(product)