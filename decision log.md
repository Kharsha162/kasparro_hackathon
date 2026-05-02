**Decision Log**

**1\. Choice of Architecture: Layered Modular Design**

**Decision**

Adopted a layered architecture consisting of Frontend, Backend, AI Layer, and Database.

**Reason**

*   Ensures separation of concerns
*   Enables independent scaling of components
*   Simplifies maintenance and debugging

**2\. Backend Framework: FastAPI**

**Decision**

Selected FastAPI for backend development.

**Reason**

*   High performance with asynchronous support
*   Built-in validation using Pydantic
*   Easy integration with AI services

**3\. Frontend Framework: Next.js**

**Decision**

Used Next.js for building the user interface.

**Reason**

*   Supports modern SaaS UI patterns
*   Enables fast rendering and routing
*   Easy API integration

**4\. AI Model Strategy: Groq + OpenAI Hybrid**

**Decision**

Used a combination of Groq API and OpenAI API.

**Reason**

*   Groq provides low-latency inference for simulations
*   OpenAI provides strong reasoning and rewriting capabilities
*   Balances speed and intelligence

**5\. Multi-Agent Simulation (AI Shadow Shopper)**

**Decision**

Implemented multiple AI personas instead of a single evaluation model.

**Reason**

*   Simulates real-world AI variability
*   Provides diverse perspectives on the same product
*   Improves reliability of insights

**6\. Explainability via Replay Mode**

**Decision**

Added step-by-step AI decision visualization.

**Reason**

*   Converts black-box AI into transparent system
*   Helps users understand failure points
*   Enhances trust and usability

**7\. Auto-Fix Engine Instead of Manual Suggestions**

**Decision**

Automated product content optimization using AI.

**Reason**

*   Reduces manual effort
*   Provides immediate actionable output
*   Ensures consistent improvements

**8\. AI Trust Score System**

**Decision**

Introduced a scoring mechanism (0–100 scale).

**Reason**

*   Converts qualitative analysis into measurable metric
*   Enables before/after comparison
*   Simplifies decision-making for users

**9\. Database Choice: PostgreSQL / SQLite**

**Decision**

Used SQLite for development and PostgreSQL for production.

**Reason**

*   SQLite is lightweight and easy for local setup
*   PostgreSQL supports scalability and reliability

**10\. Containerization with Docker**

**Decision**

Designed the system for Docker-based deployment.

**Reason**

*   Ensures consistent environments
*   Simplifies deployment
*   Supports scalability in cloud environments

**11\. REST API Design**

**Decision**

Adopted RESTful API architecture.

**Reason**

*   Standardized communication
*   Easy frontend-backend integration
*   Scalable and stateless

**12\. Focus on AI Interpretability (Core Product Direction)**

**Decision**

Focused on how AI understands products rather than traditional analytics.

**Reason**

*   Aligns with emerging AI-driven commerce trends
*   Differentiates from existing tools
*   Solves a future-facing problem