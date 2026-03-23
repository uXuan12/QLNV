# Auth Login Implementation Guide

## Backend Setup (Spring Boot)

### 1. Dependencies

- Spring Boot 4.0.4
- Spring Security 6+
- JWT (JJWT 0.12.5)
- MySQL for User storage
- Lombok for clean code

### 2. Created Components

#### DTOs

- **LoginRequest**: Contains `username` and `password` with validation
- **AuthResponse**: Contains `accessToken`, `role`, `userId`, `username`

#### JWT Provider (`JwtTokenProvider`)

- Generates JWT tokens with user claims
- Validates and parses tokens
- Implements secure signing with HMAC-SHA256

#### Auth Service (`AuthService`)

- Authenticates users against the database
- Uses BCrypt for password encryption
- Returns JWT token on successful login

#### Auth Controller

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin@123"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "role": "ADMIN",
  "userId": 1,
  "username": "admin"
}
```

#### Security Config

- BCryptPasswordEncoder for password hashing
- CORS configuration for Angular frontend

### 3. Configuration

**application.properties:**

```properties
jwt.secret=mySecretKeyForJWTTokenGenerationAndValidationPurposeOnly12345
jwt.expiration=86400000  # 24 hours
```

### 4. Test Users (Auto-created on startup)

- **Admin**: username: `admin`, password: `admin@123`
- **User**: username: `user`, password: `user@123`

---

## Frontend Setup (Angular)

### 1. Auth Service (`auth.service.ts`)

- Calls `POST /api/auth/login`
- Stores JWT and role in localStorage
- Provides helper methods:
  - `isLoggedIn()`: Check authentication status
  - `getAccessToken()`: Retrieve JWT token
  - `getUserRole()`: Get user role
  - `logout()`: Clear stored tokens

### 2. Login Component (`app.login.ts`)

- Standalone Component using ReactiveFormsModule
- Validation:
  - Username: Required, min 3 characters
  - Password: Required, min 6 characters
- Features:
  - Real-time validation feedback
  - Loading state during login
  - Error message display
  - Auto-redirect to employees page on success

### 3. Auth Interceptor (`auth.interceptor.ts`)

- Automatically adds JWT token to all API requests
- Pattern: `Bearer {token}` in Authorization header
- Handles 401 responses by logging out and redirecting to login

### 4. Auth Guard (`auth.guard.ts`)

- Protects routes that require authentication
- Redirects unauthorized users to login page

### 5. UI (Tailwind CSS)

- Responsive login form with gradient background
- Real-time validation error messages
- Loading spinner during authentication
- Professional design using Tailwind CSS

---

## Testing the Flow

### 1. Start Backend

```bash
cd ems-backend
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### 2. Start Frontend

```bash
cd ems-frontend
npm install
ng serve
```

Frontend runs on `http://localhost:4200`

### 3. Test Login

1. Navigate to `http://localhost:4200/login`
2. Enter credentials:
   - Username: `admin`
   - Password: `admin@123`
3. Click "Sign In"
4. Check browser localStorage for stored JWT and role:
   - `access_token`: JWT token
   - `user_role`: User's role
   - `user_id`: User's ID
   - `username`: Username

### 4. Test API Directly with cURL

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin@123"}'
```

---

## Architecture Diagram

```
┌─────────────────────┐
│   Angular Frontend  │
│   (Port 4200)       │
└──────────┬──────────┘
           │
           │ POST /api/auth/login
           │ (LoginRequest)
           │
┌──────────▼──────────┐
│  Spring Boot App    │
│  (Port 8080)        │
├─────────────────────┤
│ AuthController      │
│ AuthService         │
│ JwtTokenProvider    │
│ UserRepository      │
└──────────┬──────────┘
           │
           │ SELECT * FROM user WHERE username = ?
           │
┌──────────▼──────────┐
│   MySQL Database    │
└─────────────────────┘

Response Flow:
┌─────────────────────┐
│   AuthResponse      │
│  - accessToken      │
│  - role             │
│  - userId           │
│  - username         │
└──────────┬──────────┘
           │ localStorage
           │
┌──────────▼──────────┐
│  Browser Storage    │
│  - JWT Token        │
│  - User Role        │
│  - User ID          │
└─────────────────────┘
```

---

## Key Features

✅ **JWT Authentication**: Industry-standard token-based auth
✅ **Password Encryption**: BCrypt hashing for security
✅ **CORS Support**: Secure cross-origin requests
✅ **Error Handling**: Global exception handler with meaningful messages
✅ **Token Storage**: Secure localStorage with auto-logout on 401
✅ **Route Protection**: AuthGuard for protecting authenticated routes
✅ **Clean Code**: Lombok's @RequiredArgsConstructor for dependency injection
✅ **Reactive Forms**: Angular ReactiveFormsModule with validation
✅ **Responsive UI**: Tailwind CSS mobile-friendly design

---

## Next Steps

1. **Access Control**: Implement role-based access control (RBAC)
2. **Token Refresh**: Add refresh token mechanism for long sessions
3. **2FA**: Add two-factor authentication for enhanced security
4. **User Management**: Create user registration endpoint
5. **Audit Logging**: Log all authentication events
