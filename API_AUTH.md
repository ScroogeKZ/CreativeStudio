# 🔐 API Authentication Documentation

## Обзор

Добавлена JWT-аутентификация для защиты админских endpoints.

## Endpoints

### 🔓 Публичные endpoints (без авторизации)

- `GET /api/services` - Получить все сервисы
- `GET /api/services/:slug` - Получить сервис по slug
- `GET /api/cases` - Получить все кейсы
- `GET /api/cases/:slug` - Получить кейс по slug
- `GET /api/posts` - Получить все посты
- `GET /api/posts/:slug` - Получить пост по slug
- `GET /api/testimonials` - Получить отзывы
- `POST /api/contacts` - Создать обращение

### 🔑 Аутентификация

#### POST /api/auth/login

Вход в систему для админа.

**Request:**
```json
{
  "email": "admin@creativestudio.kz",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@creativestudio.kz",
    "name": "Admin"
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid credentials"
}
```

### 🔒 Защищённые endpoints (требуют авторизации)

Для доступа нужно добавить заголовок:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### GET /api/admin/contacts

Получить все обращения из контактной формы.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Иван Петров",
    "email": "ivan@example.com",
    "phone": "+7 777 123 45 67",
    "company": "Example Corp",
    "message": "Хочу обсудить проект",
    "status": "new",
    "createdAt": "2024-01-10T12:00:00Z"
  }
]
```

#### PATCH /api/admin/contacts/:id/status

Изменить статус обращения.

**Request:**
```json
{
  "status": "contacted" // "new" | "contacted" | "closed"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "contacted",
  ...
}
```

## 🔐 Безопасность

### Созданы защиты:

1. **JWT токены** - Expires in 7 days
2. **Bcrypt хеширование** - Пароли хешируются с salt=10
3. **Rate Limiting**:
   - API: 100 запросов/15 минут
   - Contact form: 5 запросов/час
4. **Helmet headers** - Security HTTP headers
5. **Trust Proxy** - Правильная работа за reverse proxy

### Первый админ:

```bash
Email: admin@creativestudio.kz
Password: admin123
```

⚠️ **ВАЖНО:** Смените пароль после первого входа!

### Создание нового админа:

```bash
tsx server/create-admin.ts
```

Или через переменные окружения:
```bash
ADMIN_EMAIL=new@admin.com ADMIN_PASSWORD=secure123 ADMIN_NAME="New Admin" tsx server/create-admin.ts
```

## 📝 Примеры использования

### JavaScript/Fetch:

```javascript
// Login
const login = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'admin@creativestudio.kz', 
    password: 'admin123' 
  })
});

const { token } = await login.json();

// Use token for protected requests
const contacts = await fetch('/api/admin/contacts', {
  headers: { 
    'Authorization': `Bearer ${token}` 
  }
});
```

### cURL:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@creativestudio.kz","password":"admin123"}'

# Get contacts (with token)
curl http://localhost:5000/api/admin/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔄 JWT Secret

По умолчанию используется тестовый секрет. Для production установите:

```bash
export JWT_SECRET="your-super-secret-key-here"
```

## ✅ Статус

- [x] JWT аутентификация
- [x] Защищённые admin endpoints
- [x] Rate limiting
- [x] Security headers
- [x] Password hashing
- [x] Trust proxy configuration
