# 🚀 Manual Import Guide (Быстрый способ)

## 📋 **Backend работает но container не работает**
Backend запущен, но `container.resolve` не работает. Это известная проблема с некоторыми Medusa v2 setups.

## 🎯 **Самый надежный способ - Manual Admin UI Import:**

### **ШАГ 1:** Откройте Admin Panel
```
http://localhost:9000/app
```

### **ШАГ 2:** Создайте категории
1. Перейдите в **Products → Categories**
2. Создайте 4 категории:

| Name | Handle | Description |
|------|--------|-------------|
| Lingerie & Intimate Apparel | lingerie | Premium lingerie and intimate apparel |
| Adult Toys & Vibrators | adult-toys | High-quality adult toys and vibrators |
| Couples & Gift Sets | couples-gifts | Perfect products for couples |
| Adult Accessories & Essentials | adult-accessories | Essential adult accessories |

### **ШАГ 3:** Импортируйте продукты
1. Перейдите в **Products → Import**
2. Загрузите файл: `adult-products.csv`
3. Medusa автоматически:
   - Создаст категории если их нет
   - Импортирует 6 adult продуктов
   - Настроит metadata, цены, изображения

### **ШАГ 4:** Проверьте результат
- **Admin:** http://localhost:9000/app/products
- **Storefront:** http://localhost:8001/products

---

## 📦 **Что содержит adult-products.csv:**

**Продукты:**
1. Red Lace Mini Dress ($27.99) - Lingerie
2. Pink Silicone Vibrator ($39.99) - Adult Toys  
3. Black Lace Teddy ($34.99) - Lingerie
4. Rabbit Vibrator ($59.99) - Adult Toys
5. Couples Gift Set ($49.99) - Couples Gifts
6. Bondage Starter Kit ($29.99) - Adult Accessories

**Metadata:**
- Бренд, материал, цвет
- Adult content флаги
- High-quality Unsplash изображения
- SEO-friendly handles

---

## ⚡ **Альтернатива: Browser Automation Script**

Если нужен автоматический импорт, используйте browser automation:

```bash
# Установите если нужно
npm install puppeteer

# Запустите автоматический импорт
node src/modules/browser-import.js
```

---

## 🎉 **Результат после импорта:**

✅ **Storefront покажет:**
- Новые adult товары на главной странице
- Фильтры по категориям (lingerie, adult-toys и т.д.)
- Cart integration с real backend данными
- Поиск найдет adult продукты

✅ **Admin Panel покажет:**
- 6 новых adult продуктов
- 4 категории с metadata
- Инвентарь и цены
- Изображения и SEO данные

---

**Это самый быстрый и надежный способ!** 🔥
