# JWT Authentication System - Complete Implementation Guide

## Architecture Overview

```
User Login Request
        ↓
   AuthController
        ↓
   AuthService (validates credentials)
        ↓
   JwtTokenProvider (generates JWT)
        ↓
   AuthResponse (returns token to frontend)
        ↓
   Frontend stores JWT in localStorage
        ↓
   Every API request includes: Authorization: Bearer {token}
        ↓
   JwtAuthenticationFilter (extracts & validates token)
        ↓
   SecurityContext (sets user authentication)
        ↓
   Spring Security authorizes request
```

---

## Component Details

### 1. JwtTokenProvider (Security Token Manager)

**Location**: `com.ems.security.JwtTokenProvider`

**Responsibilities**:

- Generate JWT tokens with user claims (userId, username, role)
- Validate JWT signatures
- Extract claims from tokens
- Handle token expiration

**Key Methods**:

```java
generateToken(userId, username, role)     // Create new token
validateToken(token)                      // Verify token signature
getUsernameFromToken(token)               // Extract username
getUserIdFromToken(token)                 // Extract userId
getRoleFromToken(token)                   // Extract role
```

**JJWT 0.12.5 Pattern**:

```java
Jwts.parser()
    .verifyWith(key)
    .parseSignedClaims(token)
    .getPayload()
```

---

### 2. JwtAuthenticationFilter (Request Interceptor)

**Location**: `com.ems.security.JwtAuthenticationFilter`

**Extends**: `OncePerRequestFilter` (executed once per request)

**Workflow**:

1. Intercepts every HTTP request
2. Extracts Bearer token from `Authorization` header
3. Validates token using JwtTokenProvider
4. Extracts user claims from token
5. Creates `UsernamePasswordAuthenticationToken`
6. Sets SecurityContext with authenticated user

**Token Format**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Role Authority Convention**:

- Token stores: `"role": "ADMIN"`
- SecurityContext sets: `"ROLE_ADMIN"` (with ROLE\_ prefix)
- This follows Spring Security convention

---

### 3. SecurityConfig (Security Policy)

**Location**: `com.ems.config.SecurityConfig`

**Spring Security 6 Features**:

- ✅ Lambda DSL: `http.csrf(csrf -> csrf.disable())`
- ✅ Stateless sessions: `SessionCreationPolicy.STATELESS`
- ✅ Role-based authorization
- ✅ JWT filter integration
- ✅ Custom authentication entry point

**Authorization Rules**:

```
POST /api/auth/login          → permitAll (public)
GET/POST /api/users/**        → hasAnyRole("ADMIN", "USER")
GET/POST /api/employees/**    → hasRole("ADMIN")
All other requests            → authenticated()
```

**Filter Chain**:

```
JwtAuthenticationFilter
        ↓
UsernamePasswordAuthenticationFilter
        ↓
Other Spring Security Filters
```

---

## API Endpoints

### 1. Login Endpoint

```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "username": "admin",
  "password": "admin@123"
}

Response (200 OK):
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "ADMIN",
  "userId": 1,
  "username": "admin"
}

Response (401 Unauthorized):
{
  "error": "Unauthorized",
  "message": "Invalid password"
}
```

### 2. Protected Endpoint Example

```
GET /api/employees
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

Response (200 OK):
[list of employees]

Response (401 Unauthorized):
{
  "error": "Unauthorized",
  "message": "Unauthorized"
}
```

---

## Security Features

### 1. Password Encryption

- Algorithm: BCrypt (configurable cost factor)
- Configured in: `SecurityConfig.passwordEncoder()`

### 2. JWT Signing

- Algorithm: HMAC SHA-256
- Key: 256-bit secret key (UTF-8 encoded)
- Expiration: 24 hours (configurable)

### 3. Token Validation

- Signature verification
- Expiration check
- Exception handling for invalid tokens

### 4. Stateless Authentication

- No session state on server
- Every request must include JWT
- Reduces server memory usage
- Enables horizontal scaling

### 5. CORS Configuration

- Allows requests from: `http://localhost:4200`
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Credentials: Enabled

---

## Configuration Files

### application.properties

```properties
# JWT Configuration
jwt.secret=mySecretKeyForJWTTokenGenerationAndValidationPurposeOnly12345
jwt.expiration=86400000  # 24 hours in milliseconds

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ems
spring.datasource.username=root
spring.datasource.password=123456

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
```

---

## Testing the Complete Flow

### 1. Start Backend

```bash
cd ems-backend
mvn clean install
mvn spring-boot:run
```

### 2. Login and Get Token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin@123"
  }'

# Response:
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6MSwicm9sZSI6IkFETUluLCJpYXQiOjE2ODA3MjE3MjAsImV4cCI6MTY4MDgwODEyMH0.xxxx",
#   "role": "ADMIN",
#   "userId": 1,
#   "username": "admin"
# }
```

### 3. Access Protected Endpoint

```bash
curl -X GET http://localhost:8080/api/employees \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6MSwicm9sZSI6IkFETUluLCJpYXQiOjE2ODA3MjE3MjAsImV4cCI6MTY4MDgwODEyMH0.xxxx"

# Response:
# [list of employees with 200 OK]
```

### 4. Access Without Token (Should Fail)

```bash
curl -X GET http://localhost:8080/api/employees

# Response (401 Unauthorized):
# {
#   "error": "Unauthorized",
#   "message": "Unauthorized"
# }
```

---

## Best Practices Implemented

✅ **No Deprecated APIs**: Using JJWT 0.12.5 `parser().verifyWith()` pattern
✅ **Spring Security 6 Lambda DSL**: Modern, readable configuration
✅ **Stateless Sessions**: STATELESS policy for scalability
✅ **Proper Role Hierarchy**: ROLE\_ prefix convention
✅ **Exception Handling**: Custom authentication entry point
✅ **Filter Ordering**: JWT filter before UsernamePasswordAuthenticationFilter
✅ **Lombok**: @RequiredArgsConstructor for clean dependency injection
✅ **@Component + @Bean**: Proper Spring integration
✅ **Separation of Concerns**: Different classes for different responsibilities

---

## Troubleshooting

### Issue: 401 Unauthorized on protected endpoints

**Solution**: Ensure token is included in Authorization header with "Bearer " prefix

### Issue: CORS errors from frontend

**Solution**: Check CorsConfig allows your frontend origin (http://localhost:4200)

### Issue: Token expires too quickly

**Solution**: Adjust `jwt.expiration` in application.properties (value in milliseconds)

### Issue: Role-based access denied

**Solution**: Verify user's role in database matches endpoint requirements (ROLE\_ prefix added automatically)

---

## Dependency Injection Flow

```
SecurityConfig
    ├─ Requires: JwtAuthenticationFilter
    │   └─ Requires: JwtTokenProvider
    │
AuthController
    └─ Requires: AuthService
        ├─ Requires: JwtTokenProvider
        ├─ Requires: PasswordEncoder
        └─ Requires: UserRepository
```

All dependencies are injected via `@RequiredArgsConstructor`, eliminating constructor boilerplate.

---

## Next Steps

1. **Token Refresh**: Implement refresh token mechanism for long sessions
2. **Remember-Me**: Add "remember me" functionality
3. **Account Lockout**: Lock accounts after failed login attempts
4. **Audit Logging**: Log all authentication events
5. **Rate Limiting**: Prevent brute force attacks
6. **2FA**: Add two-factor authentication
7. **OAuth2**: Integrate with external auth providers (Google, GitHub)
