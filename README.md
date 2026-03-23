# 🚀 Employee Management System (EMS)

A complete, production-ready employee management system built with **Spring Boot 4.0** (Java 21) and **Angular 21**.

## ✨ Features

### Backend (Spring Boot)

- ✅ **JWT Authentication** - Secure token-based auth (JJWT 0.12.5)
- ✅ **Spring Security 6** - Modern Lambda DSL configuration
- ✅ **BCrypt Password Hashing** - Cryptographically secure
- ✅ **REST APIs** - Full CRUD for employees
- ✅ **MySQL Database** - Persistent data storage
- ✅ **CORS Support** - Cross-origin requests allowed
- ✅ **Error Handling** - Global exception handler

### Frontend (Angular 21)

- ✅ **Standalone Components** - Modern Angular architecture
- ✅ **JWT Token Management** - Auto attach to requests
- ✅ **Protected Routes** - AuthGuard for access control
- ✅ **HTTP Interceptor** - Automatic Bearer token injection
- ✅ **Responsive UI** - Tailwind CSS styling
- ✅ **Loading States** - Spinner during API calls
- ✅ **Error Handling** - User-friendly error messages

## 📋 Quick Start

### Prerequisites

- Java 21+ (OpenJDK or similar)
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### 1️⃣ Backend Setup

```bash
cd ems-backend

# Install & compile
mvn clean install

# Run application
mvn spring-boot:run
```

**Backend runs on:** http://localhost:8080

**Auto-created test users:**

- Username: `admin` / Password: `admin@123` (ROLE_ADMIN)
- Username: `user` / Password: `user@123` (ROLE_USER)

### 2️⃣ Frontend Setup

```bash
cd ems-frontend

# Install dependencies
npm install

# Start development server
ng serve
```

**Frontend runs on:** http://localhost:4200

### 3️⃣ Open in Browser

Navigate to: **http://localhost:4200**

Login with:

- **Username:** `admin`
- **Password:** `admin@123`

## 🏗️ Project Structure

```
ems/
├── ems-backend/                  (Spring Boot Application)
│   ├── src/main/java/com/ems/
│   │   ├── controller/           (REST Controllers)
│   │   ├── service/              (Business Logic)
│   │   ├── repository/           (Data Access)
│   │   ├── entity/               (JPA Entities)
│   │   ├── dto/                  (Data Transfer Objects)
│   │   ├── security/             (JWT & Security)
│   │   ├── config/               (Configuration)
│   │   └── exception/            (Exception Handling)
│   └── application.properties    (Configuration)
│
├── ems-frontend/                 (Angular Application)
│   └── src/app/
│       ├── login/                (Login Component)
│       ├── employee/             (Employee Components)
│       ├── service/              (Angular Services)
│       ├── guard/                (Route Guards)
│       └── app.routes.ts         (Route Configuration)
│
└── Documentation
    ├── COMPLETE_SUMMARY.md       (Overview)
    ├── AUTH_IMPLEMENTATION.md    (Auth Details)
    ├── FRONTEND_SETUP.md         (Frontend Details)
    ├── INTEGRATION_CHECKLIST.md  (Integration Guide)
    ├── SECURITY_VERIFICATION.md  (Security Details)
    └── RUN_PROJECT.md            (Run Commands)
```

## 🔐 Authentication Flow

```
User Login → Backend Validation → JWT Token Generation
    ↓
Token Storage (localStorage) → Auto-attach to Requests
    ↓
Protected API Calls → Employee List Display
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint          | Public | Description |
| ------ | ----------------- | ------ | ----------- |
| POST   | `/api/auth/login` | ✅ Yes | User login  |

### Employees

| Method | Endpoint              | Protected | Description        |
| ------ | --------------------- | --------- | ------------------ |
| GET    | `/api/employees`      | ✅ Yes    | Get all employees  |
| GET    | `/api/employees/{id}` | ✅ Yes    | Get employee by ID |
| POST   | `/api/employees`      | ✅ Yes    | Create employee    |
| PUT    | `/api/employees/{id}` | ✅ Yes    | Update employee    |
| DELETE | `/api/employees/{id}` | ✅ Yes    | Delete employee    |

## 🔑 Test API with cURL

```bash
# 1. Login and get token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin@123"}' \
  | jq -r '.accessToken')

echo "Token: $TOKEN"

# 2. Get employees (using token)
curl -X GET http://localhost:8080/api/employees \
  -H "Authorization: Bearer $TOKEN"
```

## 🧪 Test in Browser

1. Open **DevTools** (F12)
2. Go to **Application → LocalStorage**
3. After login, you'll see:
   ```json
   {
     "access_token": "eyJhbGc...",
     "user_role": "ADMIN",
     "user_id": "1",
     "username": "admin"
   }
   ```
4. Go to **Network tab** and observe requests automatically include:
   ```
   Authorization: Bearer eyJhbGc...
   ```

## 📚 Documentation

Comprehensive documentation is available:

- **[COMPLETE_SUMMARY.md](./COMPLETE_SUMMARY.md)** - Full overview of the system
- **[FRONTEND_SETUP.md](./ems-frontend/FRONTEND_SETUP.md)** - Frontend architecture details
- **[FRONTEND_QUICKSTART.md](./ems-frontend/FRONTEND_QUICKSTART.md)** - Quick start guide
- **[INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)** - Integration verification
- **[AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md)** - Authentication details
- **[SECURITY_VERIFICATION.md](./SECURITY_VERIFICATION.md)** - Security checklist
- **[RUN_PROJECT.md](./RUN_PROJECT.md)** - How to run

## 🛠️ Technology Stack

### Backend

- **Java 21** - Latest Java version
- **Spring Boot 4.0.4** - Web framework
- **Spring Security 6** - Authentication & Authorization
- **JJWT 0.12.5** - JWT token handling
- **MySQL 8.0** - Database
- **JPA/Hibernate** - ORM
- **Lombok** - Reduce boilerplate code
- **Maven** - Build tool

### Frontend

- **Angular 21** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Styling
- **Reactive Forms** - Form handling
- **RxJS** - Reactive programming
- **npm** - Package manager

## 🔒 Security Features

✅ **JWT Tokens**

- HMAC-SHA256 signing
- 24-hour expiration
- Stored in browser localStorage

✅ **Password Security**

- BCrypt hashing (strength 10)
- Never stored in plain text
- Minimum 6 characters

✅ **HTTP Security**

- Bearer token in Authorization header
- CORS configured
- Stateless sessions (no cookies/sessions)

✅ **Route Protection**

- AuthGuard prevents unauthorized access
- 401 errors trigger automatic logout
- Protected endpoints require valid token

## 🐛 Troubleshooting

| Problem                        | Solution                                 |
| ------------------------------ | ---------------------------------------- |
| Login not working              | Verify backend running on port 8080      |
| Empty employee list            | Check backend has employees, token saved |
| CORS errors                    | Ensure CorsConfig allows frontend domain |
| Token invalid/expired          | Clear localStorage, login again          |
| Cannot access protected routes | Check token in localStorage              |
| Network errors                 | Verify both services running             |

## 📦 Build for Production

### Backend

```bash
cd ems-backend
mvn clean package

# Run JAR
java -jar target/ems-backend.jar
```

### Frontend

```bash
cd ems-frontend
ng build --configuration production

# Serve from dist/ems-frontend/browser
# Use with nginx or Apache
```

## 🚀 Deployment

Before deploying:

1. Change backend URL from `localhost:8080` to production domain
2. Use HTTPS instead of HTTP
3. Change JWT secret key to strong random string
4. Configure database connection string
5. Set environment variables
6. Enable proper logging
7. Set up monitoring

## 🎓 Learning Resources

This project demonstrates:

- Modern Spring Boot with Spring Security 6
- JWT authentication best practices
- Angular 21 with Standalone Components
- RESTful API design
- Type-safe frontend with TypeScript
- Responsive design with Tailwind CSS
- Error handling and user feedback
- Secure password storage

## 📝 License

This project is provided as-is for educational and commercial use.

## 💬 Support

For issues or questions:

1. Check the [documentation](#-documentation)
2. Review [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)
3. Check browser console for errors
4. Verify backend is running
5. Review application logs

## ✅ Checklist

Before going to production:

- [ ] All tests passing
- [ ] Backend compiled without errors
- [ ] Frontend built successfully
- [ ] Login works with test credentials
- [ ] Employee list loads
- [ ] CORS configured correctly
- [ ] JWT tokens working
- [ ] Error messages display properly
- [ ] Responsive design tested on mobile
- [ ] Security checklist completed

## 🎉 Getting Started

```bash
# Terminal 1 - Backend
cd ems-backend && mvn spring-boot:run

# Terminal 2 - Frontend
cd ems-frontend && ng serve

# Browser
http://localhost:4200
```

**Login with:** `admin` / `admin@123`

---

**Built with ❤️ for modern web development!**

Happy coding! 🚀
