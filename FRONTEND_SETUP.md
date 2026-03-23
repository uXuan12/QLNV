# Frontend Setup - Angular 21 Complete Guide

## 📋 Overview

Frontend hoàn chỉnh cho EMS (Employee Management System) sử dụng Angular 21 với JWT authentication, HTTP interceptor, auth guard, và hiển thị danh sách nhân viên.

---

## 🗂️ Project Structure

```
ems-frontend/src/app/
├── app.config.ts                    # Angular config với providers
├── app.routes.ts                    # Routes definition
├── app.ts                           # Root component
├── login/
│   ├── app.login.ts                 # Login component (Standalone)
│   └── app.login.html               # Login template
├── employee/
│   └── employee-list.component.ts   # Employee list component (Standalone)
├── guard/
│   └── auth.guard.ts                # Auth guard bảo vệ routes
└── service/
    ├── auth.service.ts              # Authentication service
    ├── auth.interceptor.ts          # HTTP interceptor thêm JWT token
    └── employee.service.ts          # Employee API service
```

---

## 🔐 Authentication Flow

```
1. User Login
   ├─ login.component → AuthService.login()
   └─ POST /api/auth/login (username, password)
        ↓
2. Backend Response
   ├─ AuthResponse { accessToken, role, userId, username }
   └─ AuthService lưu vào localStorage:
        ├─ access_token
        ├─ user_role
        ├─ user_id
        └─ username
        ↓
3. Redirect to Employees
   └─ Router.navigate(['/employees'])
        ↓
4. Protected Route
   ├─ AuthGuard kiểm tra token
   └─ Cho phép truy cập nếu có token
        ↓
5. Load Employees
   ├─ AuthInterceptor tự động thêm: Authorization: Bearer <token>
   └─ GET /api/employees → EmployeeListComponent
```

---

## 📁 File Details

### 1. **AuthService** (`service/auth.service.ts`)

```typescript
// Login
login(credentials: LoginRequest): Observable<AuthResponse>

// Token Management
getAccessToken(): string | null
getUserRole(): string | null
getUserId(): string | null
getUsername(): string | null

// Status Check
isLoggedIn(): boolean

// Logout
logout(): void
```

**Lưu trữ:**

- `access_token` - JWT token
- `user_role` - User's role (ADMIN, USER)
- `user_id` - User's ID
- `username` - Username

---

### 2. **AuthInterceptor** (`service/auth.interceptor.ts`)

**Chức năng:**

- ✅ Tự động lấy token từ localStorage
- ✅ Thêm vào header: `Authorization: Bearer {token}`
- ✅ Xử lý 401 Unauthorized → đăng xuất & redirect /login

**Tất cả requests sẽ tự động có JWT token** (không cần manual)

---

### 3. **AuthGuard** (`guard/auth.guard.ts`)

**Bảo vệ routes:**

```typescript
{
  path: 'employees',
  component: EmployeeListComponent,
  canActivate: [AuthGuard]
}
```

**Kiểm tra:**

- ✅ Token tồn tại trong localStorage?
- ✅ Nếu YES → cho truy cập
- ✅ Nếu NO → redirect /login

---

### 4. **EmployeeService** (`service/employee.service.ts`)

```typescript
getAllEmployees(): Observable<Employee[]>
getEmployeeById(id: number): Observable<Employee>
createEmployee(employee: Employee): Observable<Employee>
updateEmployee(id: number, employee: Employee): Observable<Employee>
deleteEmployee(id: number): Observable<void>
```

---

### 5. **EmployeeListComponent** (`employee/employee-list.component.ts`)

**Tính năng:**

- 📊 Hiển thị danh sách nhân viên trong bảng
- 🔄 Loading state với spinner
- ❌ Error handling với retry button
- 🚪 Button đăng xuất ở header
- 👤 Hiển thị username đăng nhập
- 🔐 Chỉ accessible nếu đã login

**Styling:** Tailwind CSS dark theme (slate-900 background)

---

## 🚀 Routes Configuration

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "employees",
    component: EmployeeListComponent,
    canActivate: [AuthGuard], // Protected
  },
  { path: "", redirectTo: "employees", pathMatch: "full" },
];
```

**Logic:**

1. User trước tiên truy cập `/` → redirect `/employees`
2. AuthGuard kiểm tra token → đăng nhập nếu chưa có
3. Sau login thành công → hiển thị danh sách nhân viên

---

## 🔧 Configuration

### **Backend URL**

```typescript
// service/auth.service.ts
private apiUrl = 'http://localhost:8080/api/auth';

// service/employee.service.ts
private apiUrl = 'http://localhost:8080/api/employees';
```

**Thay đổi nếu backend chạy ở port khác:**

- Update URL trong AuthService
- Update URL trong EmployeeService

---

## ⚙️ App Config

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
```

**Điều quan trọng:**

- `HTTP_INTERCEPTORS` - Đảm bảo AuthInterceptor chạy cho tất cả requests
- `provideRouter(routes)` - Định tuyến
- `provideHttpClient()` - HTTP client

---

## 🧪 Testing

### Step 1: Start Backend

```bash
cd ems-backend
mvn spring-boot:run
```

Backend chạy ở `http://localhost:8080`

### Step 2: Start Frontend

```bash
cd ems-frontend
npm install
ng serve
```

Frontend chạy ở `http://localhost:4200`

### Step 3: Test Login

1. Truy cập `http://localhost:4200`
2. Sẽ được redirect tới `/login` (vì chưa login)
3. Nhập: `admin` / `admin@123` (test user)
4. Click "Sign In"
5. Kiểm tra localStorage:
   ```
   access_token: "eyJhbGc..."
   user_role: "ADMIN"
   user_id: "1"
   username: "admin"
   ```
6. Sẽ được redirect tới `/employees` và xem danh sách

### Step 4: Test API with cURL

```bash
# Lấy token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin@123"}'

# Response:
# {
#   "accessToken": "eyJhbGc...",
#   "role": "ADMIN",
#   "userId": 1,
#   "username": "admin"
# }

# Lấy danh sách nhân viên (cần token)
curl -X GET http://localhost:8080/api/employees \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 🎨 UI Components

### Login Page

- **Background:** Blue gradient
- **Form:** Username + Password
- **Validation:** Real-time error messages
- **Loading:** Spinner during login
- **Error:** Display error messages

### Employee List Page

- **Header:** Dark navbar with logout button
- **Table:** Responsive with employee details
- **States:** Loading, Error, Success
- **Styling:** Tailwind CSS dark theme

---

## 🔒 Security Features

✅ **JWT Authentication**

- Token lưu trong localStorage
- Tự động thêm vào requests via Interceptor

✅ **Auto Logout on 401**

- Nếu token hết hạn → Interceptor tự động logout
- Redirect về /login

✅ **Route Protection**

- AuthGuard kiểm tra token trước khi vào route
- Ngăn unauthorized access

✅ **Error Handling**

- Hiển thị error messages thân thiện
- Retry button và retry logic

---

## 🐛 Troubleshooting

| Problem              | Solution                                                |
| -------------------- | ------------------------------------------------------- |
| Login không work     | Kiểm tra backend chạy ở port 8080                       |
| Token không lưu      | Kiểm tra localStorage trong DevTools                    |
| 401 Unauthorized     | Token hết hạn, cần login lại                            |
| CORS error           | Backend CorsConfig cấu hình `http://localhost:4200`     |
| Employees page trống | Kiểm tra Backend có data, AuthInterceptor có thêm token |

---

## 📦 Dependencies

```json
{
  "@angular/core": "^21.0.0",
  "@angular/common": "^21.0.0",
  "@angular/forms": "^21.0.0",
  "@angular/router": "^21.0.0",
  "tailwindcss": "latest"
}
```

---

## 📌 Summary

**Frontend Components:**

1. ✅ AuthService - Login & token management
2. ✅ AuthInterceptor - Auto-attach JWT token
3. ✅ AuthGuard - Protect routes
4. ✅ EmployeeService - API calls
5. ✅ EmployeeListComponent - Display employees
6. ✅ LoginComponent - User login form

**Key Features:**

- Standalone Components (Angular 21 best practice)
- Responsive UI with Tailwind CSS
- Proper error handling
- Auto logout on 401
- Clean code with dependency injection

**Ready for Production!** 🚀
