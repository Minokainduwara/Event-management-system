# 📌 University Event Management System

A full-stack web application for managing university events with role-based authentication and authorization.

![Stack](https://img.shields.io/badge/Stack-Spring%20Boot%20%7C%20React%20%7C%20MySQL%20%7C%20JWT-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Tech Stack

### 🖥 Frontend
- **React** (Vite)
- **React Router**
- **ky** (HTTP client)
- **Tailwind CSS / CSS**

### ⚙️ Backend
- **Spring Boot**
- **Spring Security**
- **Spring Data JPA**
- **JWT Authentication**
- **BCrypt** Password Encryption

### 🗄 Database
- **MySQL**

---

## ✨ Features

### 🔐 Authentication
- User Registration
- Login System
- JWT Token Authentication
- Password Encryption (BCrypt)

### 👥 Role-Based Access Control
| Role | Dashboard Route |
|------|----------------|
| `ADMIN` | `/admin` |
| `ORGANIZER` | `/organizer` |
| `STUDENT` | `/student` |

---

## 📁 Project Structure

### ⚙️ Backend
```
backend/
├── controller/
├── model/
├── repository/
├── security/
├── config/
└── application.properties
```

### ⚛️ Frontend
```
frontend/
├── src/
│   ├── pages/
│   │   └── Login.jsx
│   ├── api.js
│   └── App.jsx
```

### 🗄 Database
```
database.sql
```

---

## ⚙️ Setup Instructions

### 1. 🗄 Database Setup (MySQL)

**Option A — Run the SQL script:**
```bash
mysql -u root -p < database.sql
```

**Option B — Run manually:**
```sql
CREATE DATABASE eventdb;

USE eventdb;

CREATE TABLE users (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    email    VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role     VARCHAR(20)
);
```

---

### 2. ⚙️ Backend Setup (Spring Boot)

**Configure `application.properties`:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/eventdb
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```

**Run the backend:**
```bash
mvn spring-boot:run
```

> Backend runs at: `http://localhost:8080`

---

### 3. ⚛️ Frontend Setup (React + Vite + Bun)

**Install dependencies:**
```bash
bun install
```

**Create a `.env` file:**
```env
VITE_API_URL=http://localhost:8080/api
```

**Run the frontend:**
```bash
bun run dev
```

> Frontend runs at: `http://localhost:5173`

---

## 🔐 Authentication Flow

```
User Registers
     │
     ▼
Password hashed with BCrypt → Stored in MySQL
     │
     ▼
User Logs In
     │
     ▼
Backend validates credentials
     │
     ▼
JWT Token generated (via JwtUtil singleton)
     │
     ▼
Token + Role returned to frontend
     │
     ▼
Frontend stores token in localStorage
     │
     ▼
User redirected based on role
```

All subsequent requests include:
```
Authorization: Bearer <token>
```

---

## 📌 API Endpoints

### 🔐 Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |

### Example Login Request
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### Example Login Response
```json
{
  "token": "jwt_token_here",
  "role": "STUDENT"
}
```

---

## 🧠 Architecture & Design Patterns

### ✅ Singleton Pattern
Used in `JwtUtil` — ensures a single instance manages all token operations.

### ✅ MVC Pattern (Spring Boot)
- **Controller** → Handles API logic
- **Model** → Entity definitions
- **Repository** → Database access via Spring Data JPA

### ✅ Component-Based UI (React)
Modular, reusable components with role-based routing.

---

## 🚀 Roadmap / Future Improvements

- [ ] JWT validation filter (Spring Security)
- [ ] Refresh token system
- [ ] Admin dashboard APIs
- [ ] Event CRUD system
- [ ] File upload (event banners)
- [ ] Email verification

---

## 👨‍💻 Author

Built by a Full Stack Developer passionate about:
- 🌐 Web Development
- 🤖 AI & Systems
- 🚀 Startup building
- ♟️ Chess & Problem Solving

---

## ⭐ Support

If you found this project useful, give it a ⭐ on GitHub and feel free to contribute or fork it!