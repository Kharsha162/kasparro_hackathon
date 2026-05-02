# Quick Start: Authentication System

## Prerequisites
- Node.js 18+ installed
- Python 3.11+ installed
- PostgreSQL running (via Docker)
- Docker running

## Setup Steps

### 1. Start the Database
```bash
cd "c:\Kasparro project"
docker-compose up -d db
```

Wait 5-10 seconds for PostgreSQL to be ready.

### 2. Initialize Backend Database Tables
```bash
cd backend
python init_db.py
```

You should see: `✓ Database tables created successfully`

### 3. Create Backend Environment File
Create or verify `.env` file in the backend directory:
```
DATABASE_URL=postgresql://user:password@localhost:5432/ai_store_reality
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

### 4. Install and Start Backend
```bash
# From backend directory
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see: `Uvicorn running on http://0.0.0.0:8000`

### 5. Install and Start Frontend (in new terminal)
```bash
cd frontend
npm install
npm run dev
```

You should see: `ready - started server on 0.0.0.0:3000`

## Testing the Authentication System

### Test 1: Sign Up
1. Open `http://localhost:3000/signup`
2. Enter an email (e.g., `test@example.com`)
3. Enter a password (minimum 8 characters)
4. Confirm the password
5. Click "Create account"
6. You should be redirected to `/dashboard`

### Test 2: Verify Dashboard Access
- Dashboard should display your email
- You should see three cards: Store Analysis, Simulations, Insights
- Logout button should be visible in the header

### Test 3: Logout and Re-login
1. Click "Logout" button
2. You should be redirected to home page
3. Go to `http://localhost:3000/login`
4. Enter the same email and password
5. Click "Sign in"
6. You should be redirected back to dashboard

### Test 4: Protected Route
1. Logout
2. Try to access `http://localhost:3000/dashboard` directly
3. You should be automatically redirected to `/login`

### Test 5: API Endpoints (using curl)

**Sign Up:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test2@example.com\",\"password\":\"password123\"}"
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test2@example.com&password=password123"
```

**Get Current User (replace TOKEN with actual token):**
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Authentication System Components

### Frontend Files
- **`middleware.ts`** - Protects routes at middleware level
- **`hooks/useAuth.ts`** - React hook for auth state management
- **`app/login/page.tsx`** - Login form with API integration
- **`app/signup/page.tsx`** - Signup form with API integration
- **`app/dashboard/page.tsx`** - Protected dashboard page
- **`components/navbar.tsx`** - Dynamic navbar showing auth state

### Backend Files
- **`app/models/user.py`** - User database model
- **`app/auth/utils.py`** - Password hashing, JWT creation/validation
- **`app/routers/auth.py`** - Authentication endpoints
- **`init_db.py`** - Database initialization script

## Security Features Implemented

✅ Password hashing with bcrypt
✅ JWT token-based authentication
✅ Protected routes via middleware
✅ Token expiration (30 minutes)
✅ CORS configured
✅ Secure password validation
✅ Session management with localStorage and cookies

## Troubleshooting

### "Connection refused" when accessing `http://localhost:3000`
- Make sure `npm run dev` is running in the frontend directory

### "Connection refused" when backend can't reach database
- Ensure PostgreSQL is running: `docker-compose up -d db`
- Wait 10 seconds for it to be ready
- Check that DATABASE_URL is correct in `.env`

### "Email already registered" error
- You need to use a different email for each signup
- Or delete the user from the database using a PostgreSQL client

### Middleware not redirecting to login
- Check that `middleware.ts` exists in the `frontend` directory (not in `app`)
- Verify the middleware config has the correct matcher pattern
- Check browser console for any errors

### Token not persisting after page refresh
- Ensure localStorage and cookies are enabled in your browser
- Check that the token is being stored: Open DevTools → Application → Cookies/LocalStorage

### "Could not validate credentials" on protected route
- Token may have expired (default: 30 minutes)
- Try logging out and logging back in
- Check that JWT_SECRET_KEY is the same in backend .env

## Next Steps

1. **Email Verification**: Implement email confirmation on signup
2. **Password Reset**: Add forgot password functionality
3. **Refresh Tokens**: Implement automatic token refresh
4. **2FA/MFA**: Add two-factor authentication
5. **Role-Based Access**: Implement different user roles
6. **Audit Logging**: Log all authentication events
7. **Rate Limiting**: Add rate limiting on auth endpoints

For detailed documentation, see [AUTH_IMPLEMENTATION.md](../AUTH_IMPLEMENTATION.md)
