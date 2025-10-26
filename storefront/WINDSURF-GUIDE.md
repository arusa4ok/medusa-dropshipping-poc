# Windsurf (Cascade) - Руководство по работе с проектом

## ⚠️ Важное ограничение Windsurf

**Windsurf (Cascade) НЕ может создавать новые файлы** - только редактировать существующие!

Это ограничение инструмента `propose_code` в Windsurf.

## ✅ Решение: Все файлы уже созданы!

Я (Claude Code) создал все необходимые файлы-заглушки (placeholders), чтобы Windsurf мог их редактировать:

### Созданные страницы:
- ✅ `app/(store)/products/page.tsx` - Страница всех продуктов
- ✅ `app/(store)/categories/page.tsx` - Страница категорий
- ✅ `app/(checkout)/cart/page.tsx` - Корзина
- ✅ `app/(checkout)/checkout/page.tsx` - Чекаут
- ✅ `app/(checkout)/layout.tsx` - Layout для чекаута
- ✅ `public/pattern.svg` - SVG паттерн

### Основные компоненты (уже созданы):
- ✅ `components/ui/Button.tsx`
- ✅ `components/ui/PriceDisplay.tsx`
- ✅ `components/products/ProductCard.tsx`
- ✅ `components/products/ProductGrid.tsx`
- ✅ `components/layout/NavigationHeader.tsx`
- ✅ `components/layout/Footer.tsx`
- ✅ `components/layout/Hero.tsx`

## 🎯 Как работать с Windsurf

### 1. Открыть проект в Windsurf
```bash
# В Windsurf откройте папку:
~/Projects/medusa-dropshipping-poc
```

### 2. Активировать MCP серверы
- Command Palette (`Cmd+Shift+P`)
- Найти: "MCP: Reload Servers"
- Это даст доступ к файлам проекта и документации

### 3. Команды для Windsurf (примеры)

#### Добавить функционал в существующий компонент:
```
Edit components/products/ProductCard.tsx
Add a wishlist heart icon button in the top-right corner
```

#### Улучшить существующую страницу:
```
Edit app/(store)/products/page.tsx
Add the ProductGrid component from components/products/ProductGrid.tsx
and add filters for price range and categories
```

#### Создать новый компонент (нужен placeholder):
```
Сначала я (Claude Code) создам:
components/products/ProductFilter.tsx

Затем Windsurf может редактировать:
Edit components/products/ProductFilter.tsx
Create a filter component with price range slider,
category checkboxes, and sort dropdown
```

## 📋 TODO компоненты (нужно создать placeholders)

Если нужны эти компоненты, скажите мне, и я создам placeholders:

- [ ] `components/products/ProductDetail.tsx` - Детальная страница продукта
- [ ] `components/products/ProductFilter.tsx` - Фильтры продуктов
- [ ] `components/cart/CartItem.tsx` - Элемент корзины
- [ ] `components/cart/CartSummary.tsx` - Итоги корзины
- [ ] `components/checkout/ShippingForm.tsx` - Форма доставки
- [ ] `components/checkout/PaymentForm.tsx` - Форма оплаты
- [ ] `components/ui/Input.tsx` - Input компонент
- [ ] `components/ui/Select.tsx` - Select компонент
- [ ] `components/ui/Modal.tsx` - Modal компонент
- [ ] `lib/cart-store.ts` - Zustand store для корзины
- [ ] `app/(store)/products/[handle]/page.tsx` - Dynamic route для продукта

## 🚀 Workflow: Claude Code + Windsurf

### 1. Claude Code (я):
- Создаю новые файлы и структуру
- Устанавливаю зависимости
- Настраиваю конфигурации
- Запускаю серверы
- Делаю git commits

### 2. Windsurf (вы):
- Редактируете существующие файлы
- Улучшаете компоненты
- Добавляете логику и стили
- Следуете design system из `docs/design-system/`

## 📖 Полезные команды для Windsurf

### Следовать design system:
```
Read docs/design-system/secrets-shop-design-system.md
and apply the design specifications to components/products/ProductCard.tsx
```

### Добавить функционал:
```
Edit components/products/ProductGrid.tsx
Add pagination with 12 products per page
```

### Улучшить UX:
```
Edit components/layout/NavigationHeader.tsx
Add a search input with autocomplete functionality
```

### Интегрировать с Medusa:
```
Edit app/(store)/products/page.tsx
Fetch products from Medusa API and display them
with the ProductGrid component
```

## 🔄 Когда нужен Claude Code

Если Windsurf не может что-то сделать, попросите меня:

1. **Создать новый файл:**
   ```
   @Claude создай components/cart/CartItem.tsx с placeholder
   ```

2. **Установить зависимость:**
   ```
   @Claude установи framer-motion для анимаций
   ```

3. **Запустить команду:**
   ```
   @Claude запусти npm run build
   ```

4. **Сделать git commit:**
   ```
   @Claude закоммить изменения в git
   ```

## 💡 Лучшие практики

1. **Всегда читайте design system** перед изменением компонентов
2. **Тестируйте на http://localhost:8001** после каждого изменения
3. **Следуйте TypeScript типам** из `types/index.ts`
4. **Используйте Tailwind классы** из `tailwind.config.ts`
5. **Коммитьте часто** через Claude Code

## 🎨 Design System напоминания

- Primary color: `#1a1a1a` (bg-primary, text-primary)
- Accent color: `#ff6b6b` (bg-accent, text-accent)
- Secondary: `#f5f5f5` (bg-secondary)
- Используйте компоненты: `.btn`, `.card`, `.input`

## ✨ Теперь Windsurf готов к работе!

Все файлы созданы, можете редактировать их в Windsurf!
