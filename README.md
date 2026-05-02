# AI Store Reality Engine

A production-grade SaaS platform that helps Shopify merchants analyze how AI agents interpret their online stores, simulate AI shopping behavior, detect issues, and automatically improve content.

## Features

- **Authentication System**: Secure JWT-based login/signup
- **Dashboard UI**: Modern SaaS-style interface
- **Shopify Store Connection**: Integrate with Shopify APIs
- **AI Shadow Shopper**: Multi-agent simulation of AI shopping behavior
- **Replay Mode**: Step-by-step AI decision timeline
- **Perception vs Reality Analysis**: Compare AI interpretation with actual store content
- **Conversion Kill Switch Detection**: Identify barriers to AI-driven conversions
- **AI Trust Score System**: Quantify AI confidence in store content
- **Intent Coverage Analyzer**: Analyze how well the store covers customer intents
- **Auto-Fix Engine**: AI-powered content rewriting and optimization

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, Shadcn UI
- **Backend**: FastAPI (Python)
- **AI APIs**: Groq (fast simulation), OpenAI (analysis & rewriting)
- **Database**: PostgreSQL
- **Auth**: JWT-based authentication
- **Deployment**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+ (recommended)
- PostgreSQL
- Docker & Docker Compose

### Installation

1. Clone the repository.
2. Copy `.env.example` to `.env` and update the values.
3. Start the database and cache services:

```bash
docker-compose up -d db redis
```

4. Install frontend dependencies:

```bash
cd frontend
npm install
```

5. Install backend dependencies:

```bash
cd ../backend
python -m pip install -r requirements.txt
```

> On Windows, installing Python packages with native extensions may require Visual Studio Build Tools or a Python version compatible with prereleased wheels. If local install fails, use Docker.

6. Verify backend syntax:

```bash
python -m compileall app
```

7. Initialize the database tables:

```bash
cd backend
python init_db.py
```

8. Run the backend API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

9. Run the frontend app in a separate terminal:

```bash
cd frontend
npm run dev
```

### Docker

To run the full stack in containers:

```bash
docker-compose up --build
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.

## Project Structure

```
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── docker/            # Docker configurations
├── docs/              # Documentation
└── .github/           # GitHub workflows and instructions
```

## Authentication

The application uses JWT-based authentication with secure password hashing. For detailed information on the authentication system, endpoints, and security considerations, see [AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md).

**Quick Start:**
1. Navigate to `http://localhost:3000/signup` to create an account
2. Enter your email and password (minimum 8 characters)
3. You'll be redirected to the dashboard
4. The dashboard is only accessible to authenticated users

**Key Security Features:**
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with 30-minute expiration
- ✅ Protected routes via Next.js middleware
- ✅ Token stored in both localStorage and secure cookies
- ✅ CORS configured for secure cross-origin requests

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.