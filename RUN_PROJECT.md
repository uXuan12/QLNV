# Hướng Dẫn Chạy Dự Án EMS (Employee Management System)

## 📋 Yêu Cầu Tiên Quyết

### Backend

- Java 21+ (Eclipse Adoptium)
- Maven 3.6+
- MySQL 8.0+

### Frontend

- Node.js 18+
- npm 9+

---

## 🚀 Hướng Dẫn Chạy

### 1. Chạy Backend (Spring Boot)

#### Bước 1: Vào thư mục backend

```bash
cd ems-backend
```

#### Bước 2: Cài đặt dependencies

```bash
mvn clean install
```

#### Bước 3: Chạy ứng dụng

```bash
mvn spring-boot:run
```

**Hoặc** - Build JAR rồi chạy:

```bash
mvn clean package
java -jar target/ems-backend-0.0.1-SNAPSHOT.jar
```

✅ Backend chạy tại: `http://localhost:8080`

#### Kiểm tra Backend đã sẵn sàng

```bash
curl http://localhost:8080/api/auth/login
```

---

### 2. Chạy Frontend (Angular)

#### Bước 1: Vào thư mục frontend

```bash
cd ems-frontend
```

#### Bước 2: Cài đặt dependencies

```bash
npm install
```

#### Bước 3: Chạy development server

```bash
ng serve
```

Hoặc:

```bash
npm start
```

✅ Frontend chạy tại: `http://localhost:4200`

---

## 🎯 Thứ Tự Chạy Đúng

### Nếu chạy lần đầu:

**Terminal 1 - Backend:**

```bash
cd ems-backend
mvn clean install
mvn spring-boot:run
# Chờ log: "Started EmsBackendApplication"
```

**Terminal 2 - Frontend:**

```bash
cd ems-frontend
npm install
ng serve
# Chờ: "Application bundle generation complete"
```

**Truy cập ứng dụng:**

- Frontend: http://localhost:4200
- Backend API: http://localhost:8080

---

## 🔐 Đăng Nhập Test

Người dùng được tạo tự động khi backend start:

### Admin User

- Username: `admin`
- Password: `admin@123`

### Regular User

- Username: `user`
- Password: `user@123`

---

## 📊 Kiểm Tra Kết Nối

### Test Backend

```bash
# Login để lấy JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin@123"
  }'

# Response:
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
#   "role": "ADMIN",
#   "userId": 1,
#   "username": "admin"
# }
```

### Test API with Token

```bash
curl -X GET http://localhost:8080/api/employees \
  -H "Authorization: Bearer {accessToken}"
```

---

## 🛠️ Các Lệnh Hữu Ích

### Backend Commands

**Build project:**

```bash
mvn clean build
```

**Run tests:**

```bash
mvn test
```

**Compile only:**

```bash
mvn compile
```

**Skip tests:**

```bash
mvn clean install -DskipTests
```

---

### Frontend Commands

**Build for production:**

```bash
ng build --configuration production
```

**Run with specific port:**

```bash
ng serve --port 4201
```

**Run tests:**

```bash
ng test
```

**Lint code:**

```bash
ng lint
```

---

## 🐳 Docker (Optional)

Nếu muốn chạy MySQL trong Docker:

```bash
docker run --name mysql-ems \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=ems \
  -p 3306:3306 \
  -d mysql:8.0
```

---

## 📝 Cấu Hình Database

Nếu chạy MySQL cục bộ, hãy tạo database:

```sql
CREATE DATABASE ems;
USE ems;
```

Hoặc chạy lệnh (Linux/Mac):

```bash
mysql -u root -p123456 -e "CREATE DATABASE IF NOT EXISTS ems;"
```

---

## ⚠️ Khắc Phục Sự Cố Thường Gặp

### Port 8080 đã được sử dụng

```bash
# Kiểm tra process
lsof -i :8080

# Hoặc chạy trên port khác
java -Dserver.port=8081 -jar target/ems-backend-0.0.1-SNAPSHOT.jar
```

### Port 4200 đã được sử dụng

```bash
ng serve --port 4201
```

### MySQL không kết nối được

- Kiểm tra MySQL đã chạy: `mysql -u root -p123456`
- Kiểm tra thông tin kết nối trong `application.properties`
- Username mặc định: `root`, Password: `123456`

### Clean install nếu gặp lỗi

```bash
# Backend
mvn clean install -DskipTests

# Frontend
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 📈 Thứ Tự Quá Trình Startup

```
1. Start MySQL Database
   ↓
2. Start Backend Spring Boot
   └─ Load configurations
   └─ Auto-create tables (DDL=update)
   └─ Create test users
   └─ Listening on port 8080
   ↓
3. Start Frontend Angular
   └─ Load modules
   └─ Connect to backend
   └─ Ready at port 4200
   ↓
4. Open Browser
   └─ http://localhost:4200
   └─ Login with admin/admin@123
```

---

## ✅ Kiểm Tra Toàn Bộ Hệ Thống

Sau khi start, kiểm tra:

```bash
# 1. Backend sẵn sàng
curl http://localhost:8080/api/auth/login

# 2. Đăng nhập thành công
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin@123"}'

# 3. Frontend load
curl http://localhost:4200
```

---

## 🎓 Cấu Trúc Dự Án

```
ems/
├── ems-backend/           # Spring Boot API
│   ├── src/main/java/     # Source code
│   ├── pom.xml            # Maven configuration
│   └── target/            # Build output
│
├── ems-frontend/          # Angular App
│   ├── src/               # Source code
│   ├── angular.json       # Angular config
│   └── package.json       # NPM dependencies
```

---

**Lệnh nhanh nhất để start:**

```bash
# Terminal 1 - Backend
cd ems-backend && mvn spring-boot:run

# Terminal 2 - Frontend
cd ems-frontend && ng serve

# Open http://localhost:4200 và đăng nhập với admin/admin@123
```
