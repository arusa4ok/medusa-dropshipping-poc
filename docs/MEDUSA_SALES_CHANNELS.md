# Medusa Sales Channels - Важные моменты

> Документация основана на официальной документации Medusa из Context7

## Ключевая информация

### ⚠️ ВАЖНО: Продукты ДОЛЖНЫ быть связаны с Sales Channel

**Продукты не будут отображаться в storefront, если они не связаны с sales channel!**

Это критический момент, который часто упускается при создании продуктов через API.

## Связывание продуктов с Sales Channel

### Через Admin API

```typescript
// Добавить продукты к sales channel
await axios.post(
  `${MEDUSA_URL}/admin/sales-channels/${salesChannelId}/products`,
  {
    add: ["prod_123", "prod_456"],
    remove: ["prod_789"] // опционально
  },
  {
    headers: { 
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  }
);
```

### Через Medusa SDK

```typescript
sdk.admin.salesChannel.updateProducts("sc_123", {
  add: ["prod_123", "prod_456"],
  remove: ["prod_789"]
})
.then(({ sales_channel }) => {
  console.log(sales_channel)
})
```

### Batch операция

```typescript
sdk.admin.salesChannel.batchProducts("sc_123", {
  add: ["prod_123", "prod_456"],
  remove: ["prod_789"]
})
.then(({ sales_channel }) => {
  console.log(sales_channel)
})
```

## Получение Sales Channels

```typescript
// Список всех sales channels
const response = await axios.get(`${MEDUSA_URL}/admin/sales-channels`, {
  headers: { Authorization: `Bearer ${authToken}` }
});
const salesChannels = response.data.sales_channels;
```

```typescript
// Через SDK
sdk.admin.salesChannel.list()
.then(({ sales_channels, count, limit, offset }) => {
  console.log(sales_channels)
})
```

## Получение продуктов с sales channels

```typescript
// Получить sales channel с продуктами
sdk.admin.salesChannel.retrieve("sc_123", {
  fields: "id,*products"
})
.then(({ sales_channel }) => {
  console.log(sales_channel)
})
```

## Store API - фильтрация по Sales Channel

```javascript
// Получить продукты из конкретного sales channel
const response = await api.get(
  `/store/products?sales_channel_id[]=${salesChannel1.id}`
)
```

```javascript
// Получить продукты из нескольких sales channels
const response = await api.get(
  `/store/products?sales_channel_id[]=${salesChannel1.id}&sales_channel_id[]=${salesChannel2.id}`
)
```

## Publishable API Keys и Sales Channels

### ⚠️ Важно: Publishable API Key должен иметь настроенный Sales Channel

Ошибка при отсутствии sales channel:
```json
{
  "type": "invalid_data",
  "message": "Publishable key needs to have a sales channel configured."
}
```

### Связывание API Key с Sales Channel

```bash
curl -X POST 'http://localhost:9000/admin/api-keys/apk_123/sales-channels' \
-H 'Authorization: Bearer {token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "add": ["sc_123"]
}'
```

```typescript
sdk.admin.apiKey.batchSalesChannels("apk_123", {
  add: ["sc_123"],
  remove: ["sc_321"]
})
.then(({ api_key }) => {
  console.log(api_key)
})
```

## Workflow для связывания продуктов

```typescript
import { linkProductsToSalesChannelWorkflow } from "@medusajs/medusa/core-flows"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await linkProductsToSalesChannelWorkflow(req.scope)
    .run({
      input: {
        id: "sc_123",
        add: ["prod_123"],
        remove: ["prod_321"]
      }
    })

  res.send(result)
}
```

## Link API (для модулей)

```typescript
import { Modules } from "@medusajs/framework/utils"

// Создать связь между продуктом и sales channel
await link.create({
  [Modules.PRODUCT]: {
    product_id: "prod_123"
  },
  [Modules.SALES_CHANNEL]: {
    sales_channel_id: "sc_123"
  }
})
```

## Query API - получение связанных данных

```typescript
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "sales_channels.*"
  ]
})

// products[0].sales_channels - массив связанных sales channels
```

## Типичные ошибки

### 1. Продукты не отображаются в storefront
**Причина**: Продукты не связаны с sales channel  
**Решение**: Использовать endpoint `/admin/sales-channels/{id}/products` для связывания

### 2. Publishable API Key error
**Причина**: API key не имеет настроенного sales channel  
**Решение**: Связать API key с sales channel через `/admin/api-keys/{id}/sales-channels`

### 3. Пустой список продуктов в Store API
**Причина**: Фильтр по sales_channel_id не передан или продукты не связаны  
**Решение**: Проверить связи продуктов и передать правильный sales_channel_id

## Best Practices

1. **Всегда связывайте продукты с sales channel** сразу после создания
2. **Используйте batch операции** для массового связывания продуктов
3. **Проверяйте наличие sales channel** перед созданием продуктов
4. **Используйте Query API** для получения связанных данных вместо множественных запросов
5. **Настраивайте Publishable API Keys** с правильными sales channels для storefront

## Структура Sales Channel

```typescript
interface SalesChannel {
  id: string
  name: string
  description: string | null
  is_disabled: boolean
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}
```

## Endpoints Reference

### Admin API
- `GET /admin/sales-channels` - Список sales channels
- `GET /admin/sales-channels/:id` - Получить sales channel
- `POST /admin/sales-channels` - Создать sales channel
- `POST /admin/sales-channels/:id/products` - Управление продуктами
- `POST /admin/sales-channels/:id/products/batch` - Batch управление продуктами

### Store API
- `GET /store/products?sales_channel_id[]=:id` - Фильтр продуктов по sales channel

### API Keys
- `POST /admin/api-keys/:id/sales-channels` - Управление sales channels для API key

## Примеры использования в проекте

См. файл: `scripts/seed-via-api.js` - полный пример создания продуктов с автоматическим связыванием с sales channel.
