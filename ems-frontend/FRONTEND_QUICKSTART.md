# Frontend - Quick Start Guide

## 📦 Install Dependencies

```bash
cd ems-frontend
npm install
```

## 🚀 Start Development Server

```bash
ng serve
```

Frontend sẽ chạy tại: **http://localhost:4200**

Trình duyệt sẽ **tự động mở** trang login.

---

## 🧪 Test Login

Dùng test user được tạo tự động từ backend:

- **Username:** `admin`
- **Password:** `admin@123`

Hoặc

- **Username:** `user`
- **Password:** `user@123`

---

## 📋 Features

### ✅ Standalone Components

- LoginComponent
- EmployeeListComponent
- All services use modern Angular 21 patterns

### ✅ Authentication

- JWT token storage in localStorage
- Auto attach token to all requests via Interceptor
- Auto logout on 401 Unauthorized

### ✅ Route Protection

- AuthGuard protects `/employees` route
- Unauthenticated users redirected to `/login`

### ✅ Employee Management

- View all employees in table format
- Real-time loading states
- Error handling with retry

### ✅ Responsive UI

- Tailwind CSS styling
- Mobile-friendly
- Dark theme for employees page
- Blue gradient for login page

---

## 🗺️ Routes

| Route        | Component                 | Protected |
| ------------ | ------------------------- | --------- |
| `/login`     | LoginComponent            | No        |
| `/employees` | EmployeeListComponent     | ✅ Yes    |
| `/`          | Redirects to `/employees` | -         |

---

## 📱 Browser DevTools Check

After login, check **LocalStorage** (DevTools → Application → Storage → LocalStorage):

```
access_token: "eyJhbGciOiJIUzI1NiJ9..."
user_role: "ADMIN"
user_id: "1"
username: "admin"
```

---

## 🔧 Backend Requirement

Make sure backend is running:

```bash
cd ems-backend
mvn spring-boot:run
```

Backend must be on **http://localhost:8080**

---

## 🛑 Stop Server

Press **Ctrl + C** in terminal

---

## 📚 Full Documentation

See [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) for detailed documentation.

---

## 🐛 Common Issues

### Issue: Login button not working

- **Check:** Backend running on port 8080?
- **Check:** Network tab showing correct API call?

### Issue: Empty employee list

- **Check:** Backend has employees in database?
- **Check:** Token in localStorage?

### Issue: Redirected to login after loading page

- **Check:** Token expired?
- **Check:** Backend returned 401?

---

## ✨ Next Steps

1. ✅ Test login with credentials
2. ✅ View employee list
3. ✅ Check localStorage for token
4. ✅ (Future) Add create/edit/delete employees
5. ✅ (Future) Add more features (languages, certificates)

---

**Ready to go! 🚀**

```bash
# Terminal 1 - Backend
cd ems-backend && mvn spring-boot:run

# Terminal 2 - Frontend
cd ems-frontend && ng serve
```

Then open: **http://localhost:4200**
