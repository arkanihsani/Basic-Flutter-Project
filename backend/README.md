# Mini Project - Catatan Pemasukan/Pengeluaran API

Proyek sederhana pengelola keuangan pribadi menggunakan Express.js dengan fitur autentikasi dan manajemen transaksi pemasukan/pengeluaran.

## 📦 Fitur Utama

- **User Authentication** (Register, Login, Profile Management, Account Deletion)
- **Admin User Management** (CRUD users dengan role admin)
- **Manajemen Pemasukan** (CRUD, filter by user)
- **Manajemen Pengeluaran** (CRUD, filter by user)
- **Role-based Access Control** (User & Admin roles)
- **Validasi input** dengan Joi
- **JWT Authentication** untuk proteksi endpoint
- **Logging** dengan Morgan & Winston
- **ORM** dengan Prisma
- **Database** MySQL
- **Security** dengan bcryptjs untuk password hashing

---

## 🗂️ Struktur Folder 

```
Mini Project/
├── prisma/
|   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── app.js
│   ├── server.js
│   ├── utils/
│   │   ├── base-response.js
│   │   ├── db.js
│   │   └── logger.js
│   ├── errors/
│   │   ├── base-error.js
│   │   ├── error-handler.js
│   │   └── status-codes.js
│   ├── middlewares/
│   │   ├── admin-auth.js
│   │   ├── auth-token.js
│   │   └── request-validator.js
│   └── domains/
│       ├── auth/
│       │   ├── auth-controller.js
│       │   ├── auth-routes.js
│       │   ├── auth-schema.js
│       │   └── auth-service.js
│       ├── pemasukan/
│       │   ├── pemasukan-controller.js
│       │   ├── pemasukan-routes.js
│       │   ├── pemasukan-schema.js
│       │   └── pemasukan-service.js
│       └── pengeluaran/
│           ├── pengeluaran-controller.js
│           ├── pengeluaran-routes.js
│           ├── pengeluaran-schema.js
│           └── pengeluaran-service.js
|
├── .env
├── .gitignore
├── package.json
└── README.md
```

**Keterangan:**
- `prisma/` — berisi schema dan migrasi database Prisma.
- `src/` — seluruh source code aplikasi.
  - `utils/` — utilitas umum (logger, response, db connection).
  - `errors/` — handler dan definisi error kustom.
  - `middlewares/` — middleware Express (auth, validator, admin).
  - `domains/` — modularisasi fitur utama (auth, pemasukan, pengeluaran).
- `.env` — konfigurasi environment (port, database, jwt secret).
- `package.json` — dependensi dan script npm.

## 🔌 Plugin/Library yang Digunakan

### Dependencies (Production)
- **@prisma/client** — Prisma client untuk database operations
- **express** — Web framework untuk Node.js
- **bcryptjs** — library untuk hashing password
- **jsonwebtoken** — autentikasi dan autorisasi JWT
- **joi** — validasi input yang powerful
- **dotenv** — load environment variables
- **morgan** — HTTP request logger middleware untuk Express
- **winston** — logger fleksibel dan konfigurable untuk Node.js

### DevDependencies (Development)
- **prisma** — Prisma CLI untuk schema management dan migrations
- **nodemon** — auto-restart server saat development

---

## 🗂️ Struktur Endpoint

### 🔐 Authentication & User Management
| Method | Endpoint                | Body / Params                          | Auth Required | Keterangan            |
|--------|-------------------------|----------------------------------------|---------------|-----------------------|
| POST   | `/api/v1/auth/register` | `{ name, email, password, password_confirmation, role? }` | ❌ | Register user baru (role default: "user") |
| POST   | `/api/v1/auth/login`    | `{ email, password }`                  | ❌ | Login user, dapatkan JWT token |
| GET    | `/api/v1/auth/me`       | -                                      | ✅ | Data profile user yang login |
| PUT    | `/api/v1/auth/me`       | `{ name?, email?, new_password? }`     | ✅ | Update profile user |
| DELETE | `/api/v1/auth/me`       | -                                      | ✅ | Hapus akun user yang login |

### 👨‍💼 Admin User Management 
| Method | Endpoint                      | Body / Params                          | Auth Required | Keterangan            |
|--------|-------------------------------|----------------------------------------|---------------|-----------------------|
| GET    | `/api/v1/auth/admin/users`    | -                                      | ✅ Admin | List semua user |
| GET    | `/api/v1/auth/admin/users/:id`| -                                      | ✅ Admin | Data user berdasarkan ID |
| PUT    | `/api/v1/auth/admin/users/:id`| `{ name?, email?, role? }`             | ✅ Admin | Update user oleh admin |
| DELETE | `/api/v1/auth/admin/users/:id`| -                                      | ✅ Admin | Hapus user oleh admin |

### 💰 Pemasukan (Income)
| Method | Endpoint                | Body / Params                          | Auth Required | Keterangan            |
|--------|-------------------------|----------------------------------------|---------------|-----------------------|
| POST   | `/api/v1/pemasukan/`    | `{ amount, description }`              | ✅ | Tambah pemasukan |
| GET    | `/api/v1/pemasukan/`    | -                                      | ✅ | List pemasukan user |
| GET    | `/api/v1/pemasukan/:id` | -                                      | ✅ | Data pemasukan berdasarkan ID |
| PUT    | `/api/v1/pemasukan/:id` | `{ amount?, description? }`            | ✅ | Update pemasukan |
| DELETE | `/api/v1/pemasukan/:id` | -                                      | ✅ | Hapus pemasukan |

### 💸 Pengeluaran (Expense)
| Method | Endpoint                  | Body / Params                          | Auth Required | Keterangan            |
|--------|---------------------------|----------------------------------------|---------------|-----------------------|
| POST   | `/api/v1/pengeluaran/`    | `{ amount, description }`              | ✅ | Tambah pengeluaran |
| GET    | `/api/v1/pengeluaran/`    | -                                      | ✅ | List pengeluaran user |
| GET    | `/api/v1/pengeluaran/:id` | -                                      | ✅ | Data pengeluaran berdasarkan ID |
| PUT    | `/api/v1/pengeluaran/:id` | `{ amount?, description? }`            | ✅ | Update pengeluaran |
| DELETE | `/api/v1/pengeluaran/:id` | -                                      | ✅ | Hapus pengeluaran |

---

## 🔒 Authentication & Authorization

### JWT Token
- Semua endpoint yang memerlukan auth harus mengirim header:
  ```
  Authorization: Bearer <your_jwt_token>
  ```

### User Roles
- **user** (default): Akses ke pemasukan/pengeluaran milik sendiri
- **admin**: Akses ke semua fitur + user management

### Password Requirements
- Minimal 8 karakter
- Harus mengandung: huruf besar, huruf kecil, angka, dan karakter khusus

---

## 📊 Database Schema

### User
```sql
- id: UUID (Primary Key)
- name: String
- email: String (Unique)  
- password: String (Hashed)
- role: String (default: "user")
- created_at: DateTime
- updated_at: DateTime
```

### Pemasukan 
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → User)
- amount: Float
- description: String (Optional)
- created_at: DateTime
- updated_at: DateTime
```

### Pengeluaran
```sql
- id: UUID (Primary Key) 
- user_id: UUID (Foreign Key → User)
- amount: Float
- description: String (Optional)
- created_at: DateTime
- updated_at: DateTime
```

---

## 🚀 Cara Setup & Menjalankan Secara Lokal

1. **Clone repository ini**
   ```sh
   git clone <repository_url>
   cd "Mini Project"
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set file environment**
   Buat file `.env` di root project:
   ```env
   # Database Configuration
   DATABASE_URL="mysql://root:password@localhost:3306/miniproject"
   
   # Server Configuration  
   PORT=3000
   
   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

4. **Setup Database**
   ```sh
   # Jalankan migrasi database
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Jalankan server**
   ```sh
   # Development (dengan auto-restart)
   npm run dev
   
   # Production
   npm start
   ```
   API akan berjalan di `http://localhost:3000/api/v1/`

6. **Buat Admin User (Opsional)**
  ```bash
  POST /api/v1/auth/register
  Content-Type: application/json
  
  {
    "name": "John Doe",
    "email": "john@example.com", 
    "password": "SecurePass123!",
    "password_confirmation": "SecurePass123!"
    "role": "admin"
  }
  ```

---

## 📝 Contoh Penggunaan

### 1. Register User Baru
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!"
}
```

### 2. Login & Dapatkan Token
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### 3. Tambah Pemasukan
```bash
POST /api/v1/pemasukan/
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "amount": 5000000,
  "description": "Gaji bulanan"
}
```

### 4. Tambah Pengeluaran  
```bash
POST /api/v1/pengeluaran/
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "amount": 150000,
  "description": "Makan siang"
}
```

---

## 🛡️ Security Features

- **Password Hashing** dengan bcryptjs
- **JWT Authentication** untuk session management
- **Role-based Authorization** (User & Admin)
- **Input Validation** dengan Joi schema
- **SQL Injection Protection** dengan Prisma ORM
- **Error Handling** yang aman (tidak expose sensitive data)

---

## 🔧 Development Tools

- **Logging**: Winston untuk application logs, Morgan untuk HTTP request logs
- **Hot Reload**: Nodemon untuk development
- **Database Management**: Prisma Studio (`npx prisma studio`)
- **API Testing**: Gunakan Postman atau tools serupa

---

## 📁 File Penting

- `src/utils/logger.js` — Konfigurasi logging
- `src/errors/` — Custom error handling
- `prisma/schema.prisma` — Database schema definition

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### JWT Token Expired
- Token expire dalam 1 hari (bisa diubah di `auth-service.js`)
- Login ulang untuk mendapatkan token baru

### Admin Access
- Register user admin melalui POSTMAN
- Register user biasa lalu update role di database

---
