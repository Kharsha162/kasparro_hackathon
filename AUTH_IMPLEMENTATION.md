# Authentication System Implementation

## Overview

This document describes the complete authentication system for the AI Store Reality Engine. It includes secure password hashing, JWT-based token authentication, and protected routes on both frontend and backend.

## Architecture

### Backend (FastAPI)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Password Hashing**: bcrypt via `passlib`
- **Authentication**: JWT (JSON Web Tokens) with `python-jose`
- **Authorization**: OAuth2PasswordBearer scheme

### Frontend (Next.js)
- **State Management**: localStorage for tokens + React hooks
- **Form Handling**: react-hook-form with validation
- **Route Protection**: Next.js middleware + client-side guards
- **API Communication**: Fetch API with Bearer token authentication

## Backend Implementation

### 1. User Model (`app/models/user.py`)

```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
```

**Security Note**: Passwords are never stored in plain text. They are hashed using bcrypt.

### 2. Authentication Utilities (`app/auth/utils.py`)

**Functions provided:**

- **`get_password_hash(password)`**: Hashes a plaintext password using bcrypt
- **`verify_password(plain_password, hashed_password)`**: Verifies a password against its hash
- **`authenticate_user(db, email, password)`**: Authenticates a user by email and password
- **`create_access_token(data, expires_delta)`**: Creates a JWT token valid for 30 minutes by default
- **`get_current_user(token, db)`**: Extracts and validates the current user from a JWT token

**Environment Variables:**
```
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Auth Endpoints (`app/routers/auth.py`)

#### POST `/api/auth/register`
**Register a new user**

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

**Status Codes:**
- `200`: Registration successful
- `400`: Email already registered

#### POST `/api/auth/token`
**Login with credentials**

Request (form-encoded):
```
username=user@example.com&password=securepassword123
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

**Status Codes:**
- `200`: Login successful
- `401`: Incorrect credentials

#### GET `/api/auth/me`
**Get current authenticated user**

Headers:
```
Authorization: Bearer <access_token>
```

Response:
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

**Status Codes:**
- `200`: User retrieved successfully
- `401`: Invalid or expired token

### 4. Database Setup

Initialize the database:
```bash
cd backend
python init_db.py
```

This creates all tables defined in the models.

## Frontend Implementation

### 1. Authentication Hook (`hooks/useAuth.ts`)

Provides React hook for managing authentication state:

```typescript
const { user, token, isLoading, isAuthenticated, logout, setToken } = useAuth()
```

**Returns:**
- `user`: Current user object or null
- `token`: JWT token or null
- `isLoading`: Whether user data is being fetched
- `isAuthenticated`: Boolean indicating if user is logged in
- `logout()`: Function to logout and clear state
- `setToken(token)`: Function to set token and fetch user data

### 2. Protected Routes

#### Middleware (`middleware.ts`)

- Checks for `authToken` cookie
- Redirects unauthenticated users from protected routes to `/login`
- Redirects authenticated users away from `/login` and `/signup` to `/dashboard`

**Protected Routes:**
- `/dashboard`: Requires authentication

#### Client-Side Guard (in components)

```typescript
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/login')
  }
}, [isLoading, isAuthenticated, router])
```

### 3. Authentication Pages

#### Login Page (`app/login/page.tsx`)

Features:
- Email and password input fields
- Form validation using react-hook-form
- API integration with error handling
- Loading state management
- Automatic redirect to dashboard on success

#### Signup Page (`app/signup/page.tsx`)

Features:
- Email, password, and confirm password fields
- Password validation (minimum 8 characters)
- Password match validation
- Automatic account creation and login on success

### 4. Dashboard Page (`app/dashboard/page.tsx`)

Protected page accessible only to authenticated users:
- Displays current user email
- Shows dashboard cards for store analysis, simulations, and insights
- Includes logout button in header

### 5. Navigation Component (`components/navbar.tsx`)

Dynamic navbar that shows:
- Login/Signup links for unauthenticated users
- Dashboard link and logout button for authenticated users

## Authentication Flow

### Sign Up Flow

1. User fills out signup form with email and password
2. Frontend validates form inputs
3. Frontend sends POST request to `/api/auth/register`
4. Backend:
   - Checks if email already exists
   - Hashes password using bcrypt
   - Creates new user in database
   - Generates JWT token
   - Returns token to frontend
5. Frontend stores token in localStorage and cookies
6. Frontend redirects to `/dashboard`

### Login Flow

1. User fills out login form
2. Frontend sends POST request to `/api/auth/token` (form-encoded)
3. Backend:
   - Looks up user by email
   - Verifies password hash
   - Generates JWT token
   - Returns token to frontend
4. Frontend stores token in localStorage and cookies
5. Frontend redirects to `/dashboard`

### Protected Route Access

1. User navigates to `/dashboard`
2. Middleware checks for `authToken` cookie
   - If missing: redirects to `/login`
   - If present: allows access
3. Component mounts and calls `useAuth()`
4. `useAuth()` fetches user data using token via `/api/auth/me`
5. If token is invalid, user is redirected to `/login`

### Logout Flow

1. User clicks logout button
2. Frontend clears localStorage and cookies
3. Frontend redirects to home page
4. Subsequent requests to protected routes fail auth check and redirect to login

## Security Considerations

### Backend
✅ **Password Hashing**: Using bcrypt with automatic salt generation
✅ **JWT Security**: Secret key should be strong and kept secure
✅ **Token Expiration**: Tokens expire after 30 minutes by default
✅ **CORS**: Configured to only accept requests from frontend origin
✅ **HTTPS**: Recommended for production (use TLS/SSL)

### Frontend
✅ **Token Storage**: Stored in both localStorage and secure cookies
✅ **HTTP-Only Cookies**: Should be used for tokens (currently using regular cookies)
✅ **Route Protection**: Middleware enforces protected route access
✅ **Token Refresh**: Implement refresh token rotation for production
⚠️ **Token in URL**: Avoid passing tokens in URLs

### Recommended Production Changes

1. **Use HTTP-Only Cookies**: Remove localStorage token storage
2. **Add Refresh Token Rotation**: Implement refresh token endpoint
3. **Rate Limiting**: Add rate limiting on auth endpoints
4. **Account Lockout**: Implement after failed login attempts
5. **Email Verification**: Send verification email on signup
6. **Password Reset**: Implement forgot password functionality
7. **2FA/MFA**: Add two-factor authentication
8. **Audit Logging**: Log all authentication events
9. **HTTPS Only**: Enforce HTTPS in production
10. **Environment Variables**: Use strong, random JWT secret keys

## Testing the Authentication System

### Test Sign Up
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

## Environment Setup

### Backend `.env` file
```
DATABASE_URL=postgresql://user:password@localhost:5432/ai_store_reality
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

### Frontend
- No additional setup required
- Authentication state managed automatically via hooks

## File Structure

```
frontend/
├── app/
│   ├── login/page.tsx         # Login page
│   ├── signup/page.tsx        # Signup page
│   ├── dashboard/page.tsx     # Protected dashboard
│   └── layout.tsx
├── components/
│   ├── navbar.tsx             # Dynamic navbar
│   ├── footer.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── label.tsx
├── hooks/
│   └── useAuth.ts             # Auth state management
└── middleware.ts              # Route protection

backend/
├── app/
│   ├── models/
│   │   └── user.py            # User model
│   ├── auth/
│   │   └── utils.py           # Auth utilities
│   ├── routers/
│   │   └── auth.py            # Auth endpoints
│   ├── database.py
│   └── main.py
├── init_db.py                 # Database initialization
├── requirements.txt
└── .env.example
```

## Next Steps

1. Implement email verification on signup
2. Add password reset functionality
3. Implement refresh token mechanism
4. Add role-based access control (RBAC)
5. Implement audit logging
6. Set up rate limiting on auth endpoints
7. Add 2FA/MFA support
8. Create user profile management page
