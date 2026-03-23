# 🚀 Employee Management System (EMS) - Enterprise Grade

A **production-ready, fault-tolerant** employee management system built with **Spring Boot 3.x** (Java 21) and **Angular 17** with enterprise-grade error handling and resilience.

## ✨ Features

### Backend (Spring Boot 3.x)

- ✅ **JWT Authentication** - Secure token-based auth (JJWT 0.12.5)
- ✅ **Spring Security 6** - Modern Lambda DSL configuration
- ✅ **BCrypt Password Hashing** - Cryptographically secure
- ✅ **REST APIs** - Full CRUD for employees with junction tables
- ✅ **@JsonIgnore** - Clean JSON serialization (no circular references)
- ✅ **Sample Data Seeding** - Auto-create languages & certificates
- ✅ **H2/MySQL Database** - Persistent data storage
- ✅ **CORS Support** - Cross-origin requests allowed
- ✅ **Global Error Handling** - Comprehensive exception management

### Frontend (Angular 17)

- ✅ **Standalone Components** - Modern Angular architecture
- ✅ **JWT Token Management** - Auto attach to requests
- ✅ **Protected Routes** - AuthGuard for access control
- ✅ **HTTP Interceptor** - Automatic Bearer token injection
- ✅ **Reactive Forms** - FormArray for dynamic data
- ✅ **Root Cause Fixes** - No more loading traps or crashes
- ✅ **Fault-Tolerant** - Graceful API failure handling
- ✅ **Responsive UI** - Tailwind CSS with dark theme
- ✅ **Loading States** - Smart loading management
- ✅ **Error Handling** - User-friendly error messages

## 🛡️ Enterprise Features

### Resilience & Error Handling

- **No forkJoin Trap** - Independent API loading prevents blocking
- **Form Safety** - Constructor initialization prevents undefined crashes
- **Safe Mapping** - Defensive programming with null checks
- **Graceful Degradation** - System works even with partial API failures

### Data Management

- **Junction Tables** - Many-to-many relationships (Employee ↔ Languages/Certificates)
- **Clean Serialization** - @JsonIgnore prevents circular references
- **Sample Data** - 7 languages + 7 certificates auto-seeded
- **Type Safety** - Full TypeScript interfaces with optional properties

## 📋 Quick Start

### Prerequisites

- Java 21+ (Eclipse Adoptium recommended)
- Node.js 18+
- Maven 3.9+
- Git

### 1️⃣ Clone & Setup

```bash
git clone <repository-url>
cd ems
```

### 2️⃣ Backend Setup

```bash
cd ems-backend

# Run with Maven wrapper (no Maven installation needed)
./mvnw spring-boot:run
```

**Backend runs on:** http://localhost:8080

**Auto-created data:**

- **Users:** admin/admin@123 (ADMIN), user/user@123 (USER)
- **Languages:** English, French, German, Spanish, Chinese, Japanese, Korean
- **Certificates:** AWS, Google Cloud, Microsoft Azure, Cisco CCNA, CompTIA A+, PMP, Scrum Master

### 3️⃣ Frontend Setup

```bash
cd ems-frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend runs on:** http://localhost:4200 (auto-opens in browser)

## 🎯 How to Use

### 1. Login

- **Admin:** admin / admin@123
- **User:** user / user@123

### 2. Employee Management

- **View List** - See all employees with language/certificate tags
- **Add Employee** - Dynamic FormArray for languages & certificates
- **Edit Employee** - Modify existing data safely
- **Delete Employee** - Admin-only operation

### 3. Test Resilience

- Try disabling backend APIs to see graceful degradation
- Form works even with partial data failures
- No more infinite loading states

## 🏗️ Architecture

```
┌─────────────────┐    HTTP     ┌─────────────────┐
│   Angular 17    │◄──────────►│  Spring Boot    │
│   Frontend      │             │   Backend       │
│                 │             │                 │
│ • AuthGuard     │             │ • SecurityConfig│
│ • FormArray     │             │ • @JsonIgnore   │
│ • Root Cause    │             │ • Junction Tables│
│   Fixes         │             │ • Sample Data   │
│ • Resilience    │             │ • JWT Auth      │
└─────────────────┘             └─────────────────┘
         │                               │
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│  Browser Local  │             │     H2/MySQL    │
│   Storage       │             │   Database      │
│ • JWT Tokens    │             │ • Auto-seeded   │
└─────────────────┘             └─────────────────┘
```

## 📁 Project Structure

```
ems/
├── ems-backend/                 # Spring Boot application
│   ├── src/main/java/com/ems/
│   │   ├── config/              # Security, CORS
│   │   ├── controller/          # REST endpoints
│   │   ├── entity/              # JPA entities
│   │   ├── repository/          # Data access
│   │   ├── service/             # Business logic
│   │   └── DataInitializer.java # Sample data seeding
│   └── src/main/resources/
│       └── application.properties
├── ems-frontend/                 # Angular application
│   ├── src/app/
│   │   ├── service/             # HTTP services
│   │   ├── guard/               # Route protection
│   │   ├── login/               # Authentication
│   │   ├── employee/            # CRUD components
│   │   └── app.config.ts        # App configuration
│   └── src/styles.css           # Global styles
└── *.md                         # Documentation
```

## 🔧 Development

### Backend Development

```bash
cd ems-backend
./mvnw clean compile  # Compile only
./mvnw test          # Run tests
./mvnw spring-boot:run  # Development mode
```

### Frontend Development

```bash
cd ems-frontend
npm install          # Install dependencies
npm start           # Development server
npm run build       # Production build
npm run test        # Run tests
```

## 🚀 Deployment

### Backend (JAR)

```bash
cd ems-backend
./mvnw clean package -DskipTests
java -jar target/ems-backend-0.0.1-SNAPSHOT.jar
```

### Frontend (Static Files)

```bash
cd ems-frontend
npm run build --prod
# Copy dist/ems-frontend/* to web server
```

## 📊 API Endpoints

### Authentication

- `POST /api/auth/login` - User authentication

### Employees (Admin/User)

- `GET /api/employees` - List all employees
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create employee (Admin only)
- `PUT /api/employees/{id}` - Update employee (Admin only)
- `DELETE /api/employees/{id}` - Delete employee (Admin only)

### Master Data

- `GET /api/languages` - List all languages
- `GET /api/certificates` - List all certificates

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Backend: Change `server.port` in `application.properties`
   - Frontend: Change port in `angular.json`

2. **CORS Errors**
   - Ensure backend CORS config allows frontend origin
   - Check `http://localhost:4200` is in allowed origins

3. **Database Connection**
   - H2: Auto-configured (no setup needed)
   - MySQL: Configure in `application.properties`

4. **API Loading Issues**
   - Check backend is running on port 8080
   - Verify CORS configuration
   - Check browser network tab for failed requests

## 📝 Documentation

- [Complete Implementation](./COMPLETE_SUMMARY.md) - Full system overview
- [FormArray Implementation](./FORMARRAY_IMPLEMENTATION.md) - Dynamic forms guide
- [Employee List](./EMPLOYEE_LIST_COMPLETE.md) - List component details
- [Security Implementation](./SECURITY_COMPLETE.md) - Authentication details
- [Frontend Setup](./FRONTEND_SETUP.md) - Angular configuration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Spring Boot & Angular**

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
