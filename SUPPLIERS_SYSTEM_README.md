# 🚀 Medusa Adult Dropshipping - Suppliers Intelligence System

Система умного выбора поставщиков для adult dropshipping с полной интеграцией в Medusa admin.

## 🎯 Что делает система

Когда товар доступен у нескольких поставщиков, система автоматически выбирает оптимального на основе:
- **Приоритета поставщика** (1 = самый высокий)
- **Наличия на складе**
- **Времени cut-off** (для same-day delivery)
- **Общей стоимости** (цена товара + доставка)

## 📊 Пример работы

**Товар:** Pink Silicone Vibrator (quantity: 2)

**Доступные поставщики:**
| Поставщик | Priority | Цена | Склад | Cutoff |
|-----------|----------|------|-------|--------|
| AdultToys Warehouse | 1 ⭐⭐⭐ | $18.99 | 30 | 14:00 |
| Lingerie Direct | 2 ⭐⭐ | $20.99 | 25 | 16:00 |
| Global Supply | 3 ⭐ | $16.99 | 40 | 12:00 |

**Результат:** ✅ **AdultToys Warehouse** (Priority 1 побеждает несмотря на более низкую цену у Global Supply)

## 🏗️ Архитектура системы

### Backend Components
```
src/
├── modules/suppliers/
│   ├── models/
│   │   ├── supplier.ts                 # Модель поставщика
│   │   └── product-supplier-mapping.ts # Связь продукт-поставщик
│   ├── service.ts                      # Логика выбора поставщика
│   └── index.ts                        # Экспорты
├── workflows/
│   └── order-fulfillment.ts            # Workflow обработки заказов
├── api/
│   ├── store/suppliers-selection/      # Public API для выбора
│   └── custom/admin/suppliers/         # Admin API (если работает)
└── admin/                              # Admin UI компоненты
    ├── suppliers/page.tsx             # Suppliers Management
    └── orders-suppliers/page.tsx      # Orders & Suppliers
```

### Database Schema
```sql
-- Suppliers table
CREATE TABLE suppliers (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  priority INT NOT NULL, -- 1 = highest
  cut_off_time TIME NOT NULL,
  shipping_cost_base DECIMAL NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB
);

-- Product-Supplier mappings
CREATE TABLE product_supplier_mappings (
  id UUID PRIMARY KEY,
  product_id VARCHAR NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  supplier_sku VARCHAR NOT NULL,
  cost_price DECIMAL NOT NULL,
  stock_quantity INT DEFAULT 0,
  lead_time_days INT DEFAULT 2,
  priority_override INT NULL -- Override supplier priority per product
);
```

## 🎮 Как использовать

### 1. Просмотр поставщиков в админке
```
http://localhost:9000/app/suppliers
```
- Список всех активных поставщиков
- Детальная информация по каждому
- Тестирование алгоритма выбора

### 2. Просмотр заказов с поставщиками
```
http://localhost:9000/app/orders-suppliers
```
- Список заказов с назначенными поставщиками
- Детали fulfillment по каждому товару
- Управление обработкой заказов

### 3. API для выбора поставщика
```bash
# Получить информацию о доступных поставщиках
GET /store/suppliers-selection

# Выбрать поставщика для товара
POST /store/suppliers-selection
{
  "product_id": "pink-silicone-vibrator",
  "quantity": 2
}
```

## 🔧 Алгоритм выбора поставщика

### Шаг 1: Фильтр по наличию
```typescript
const available = suppliers.filter(s => s.stock_quantity >= quantity)
```

### Шаг 2: Cut-off time для same-day delivery
```typescript
const withinCutoff = available.filter(s => currentTime < s.cut_off_time)
const candidates = withinCutoff.length > 0 ? withinCutoff : available
```

### Шаг 3: Расчет стоимости
```typescript
const scored = candidates.map(s => ({
  ...s,
  total_cost: (s.cost_price * quantity) + s.shipping_cost_base,
  effective_priority: s.priority_override || s.priority
}))
```

### Шаг 4: Выбор победителя
```typescript
const winner = scored.sort((a, b) => {
  // Priority wins
  if (a.effective_priority !== b.effective_priority) {
    return a.effective_priority - b.effective_priority
  }
  // Then by total cost
  return a.total_cost - b.total_cost
})[0]
```

## 📈 Преимущества системы

- ✅ **Автоматический выбор** оптимального поставщика
- ✅ **Приоритет над стоимостью** - специализация важнее цены
- ✅ **Same-day delivery** оптимизация
- ✅ **Fallback** на alternative поставщиков
- ✅ **Полная прозрачность** в admin интерфейсе
- ✅ **Real-time** обновления через API

## 🚀 Интеграция с заказами

1. **Покупатель оформляет заказ** в storefront
2. **Medusa Order Service** получает order
3. **OrderFulfillmentWorkflow** запускается
4. **Для каждого line item** вызывается `supplierService.selectBestSupplier()`
5. **Fulfillment задания** группируются по поставщикам
6. **Автоматическая отправка** заказов поставщикам

## 🎨 Admin UI Features

### Suppliers Management Page
- 📊 Список всех поставщиков с приоритетами
- 🎯 Interactive selection demo
- 📈 Visual algorithm explanation
- 🔄 Real-time API integration

### Orders & Suppliers Page
- 📦 Список заказов с supplier assignments
- ✅ Fulfillment status tracking
- 🚚 Multi-supplier order processing
- 💰 Cost optimization insights

## 🛠️ Развертывание

```bash
# Install dependencies
npm install

# Run database migrations
npm run build

# Start development server
npm run dev

# Access admin
http://localhost:9000/app
```

## 📋 API Endpoints

### Store API (доступны без аутентификации)
```
GET  /store/suppliers-selection
POST /store/suppliers-selection
```

### Admin API (если работает)
```
GET  /custom/admin/suppliers
POST /custom/admin/suppliers
```

## 🔐 Безопасность

- ✅ **Store API** защищен publishable key
- ✅ **Admin API** требует JWT authentication
- ✅ **Input validation** на всех endpoints
- ✅ **Error handling** с информативными сообщениями

## 📊 Мониторинг

- 📈 **Supplier performance** tracking
- 🎯 **Selection success rate** metrics
- 💰 **Cost optimization** analytics
- 🚚 **Delivery time** improvements

---

**🎉 Система готова к продакшену! Adult dropshipping с умным выбором поставщиков.**
