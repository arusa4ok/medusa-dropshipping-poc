# 📚 Medusa v2 Admin API Authentication Guide

## 🔍 **Проблема и Решение**

Основная проблема с импортом товаров через Admin API - неправильный authentication flow. После изучения документации Medusa v2, вот правильная последовательность:

## ✅ **Правильный Authentication Flow:**

### 1. **Получение JWT Token (Correct Endpoint)**
```bash
# ✅ Правильно: /auth/admin/emailpass
curl -X POST 'http://localhost:9000/auth/admin/emailpass' \
-H 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@medusa-test.com",
    "password": "supersecret"
}'

# ❌ Неправильно: /auth/user/emailpass (для regular users)
```

### 2. **Создание Secret API Key**
```bash
# Используем JWT token для создания API key
curl -X POST 'http://localhost:9000/admin/api-keys' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data '{
    "title": "Import Script Key",
    "type": "secret"
}'
```

### 3. **Использование Secret API Key**
```bash
# ✅ Правильно: Basic Auth с secret token
curl -X GET 'http://localhost:9000/admin/products' \
-H 'Authorization: Basic {base64_encoded_secret_token}:'

# ❌ Неправильно: Bearer token или x-medusa-access-token
```

## 🔧 **Working Implementation Code:**

```javascript
const axios = require('axios')

class MedusaImporter {
  async getJWTToken() {
    const response = await axios.post(`${MEDUSA_URL}/auth/admin/emailpass`, {
      email: 'admin@medusa-test.com',
      password: 'supersecret'
    })
    return response.data.token
  }

  async createSecretAPIKey(jwtToken) {
    const response = await axios.post(`${MEDUSA_URL}/admin/api-keys`, {
      title: "Import Script Key",
      type: "secret"
    }, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    })
    return response.data.api_key.token
  }

  async makeAuthenticatedRequest(secretToken, endpoint, data) {
    return await axios.post(endpoint, data, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${secretToken}:`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })
  }
}
```

## 📋 **Authentication Methods Comparison:**

| Method | Usage | Status |
|--------|-------|---------|
| **JWT Bearer Token** | `Authorization: Bearer {token}` | ❌ Не работает для admin API |
| **x-medusa-access-token** | `x-medusa-access-token: {token}` | ❌ Не работает в v2 |
| **Secret API Key (Basic)** | `Authorization: Basic {token}:` | ✅ РАБОТАЕТ |
| **Session Cookie** | `Cookie: connect.sid={sid}` | ❌ Требует browser context |

## 🚀 **Готовые Модули Импорта:**

### 1. **Complete Import Module** (`src/modules/correct-import.js`)
- ✅ Правильный authentication flow
- ✅ Автоматическое создание категорий
- ✅ Mapping категорий с товарами
- ✅ Error handling и логирование
- ✅ Verification импорта

### 2. **Simple Working Version** (`src/modules/working-import.js`)
- ✅ Минимальный рабочий пример
- ✅ JWT + Secret API Key flow
- ✅ Создание категорий и товаров

## 📦 **Что импортируют модули:**

**Категории:**
- Lingerie & Intimate Apparel (lingerie)
- Adult Toys & Vibrators (adult-toys) 
- Couples & Gift Sets (couples-gifts)
- Adult Accessories & Essentials (adult-accessories)

**Товары:**
- Red Lace Mini Dress ($27.99)
- Pink Silicone Vibrator ($39.99)
- Black Lace Teddy ($34.99)
- Rabbit Vibrator ($59.99)
- Couples Gift Set ($49.99)
- Bondage Starter Kit ($29.99)

**Metadata:**
- Бренд, материал, цвет
- Adult content флаги
- SEO-friendly handles
- High-quality изображения

## 🛠 **Запуск Импорта:**

```bash
# Запуск полного модуля
node src/modules/correct-import.js

# Запуск простой версии
node src/modules/working-import.js
```

## 🔐 **Security Best Practices:**

1. **Никогда не храните credentials в коде**
2. **Используйте environment variables**
3. **Создавайте отдельные API keys для разных скриптов**
4. **Отзывайте API keys после использования**
5. **Логируйте authentication attempts**

## 📋 **Troubleshooting:**

### Ошибка: `ECONNREFUSED ::1:9000`
**Решение:** Запустите Medusa backend `npm run dev`

### Ошибка: `401 Unauthorized`
**Решение:** Проверьте правильность authentication flow:
1. Используйте `/auth/admin/emailpass` (не `/auth/user/emailpass`)
2. Создавайте secret API key через JWT token
3. Используйте Basic Auth с secret token

### Ошибка: `Category already exists`
**Решение:** Модуль автоматически обработает существующие категории

## 🎯 **Next Steps:**

1. ✅ Запустить Medusa backend
2. ✅ Выполнить импорт через созданный модуль
3. ✅ Проверить товары в admin panel
4. ✅ Проверить отображение в storefront
5. ✅ Протестировать cart functionality

---

**Conclusion:** Правильный Medusa v2 Admin API authentication требует JWT token → Secret API Key → Basic Auth flow. Все готовые модули используют этот правильный подход.
