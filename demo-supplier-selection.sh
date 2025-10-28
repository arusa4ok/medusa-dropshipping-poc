echo "🎯 СИСТЕМА ВЫБОРА ПОСТАВЩИКА - ПОЛНАЯ ДЕМОНСТРАЦИЯ"
echo ""
echo "📊 ДОСТУПНЫЕ ПОСТАВЩИКИ:"
echo "┌─────────────────────────────────────────────────────────────────────┐"
echo "│ Поставщик              │ Priority │ Cost  │ Cutoff │ Stock │ Region │"
echo "├─────────────────────────────────────────────────────────────────────┤"
echo "│ AdultToys Warehouse EU │    1     │ $18.99│ 14:00  │  30   │   EU   │"
echo "│ Lingerie Direct        │    2     │ $20.99│ 16:00  │  25   │   EU   │"
echo "│ Global Adult Supply    │    3     │ $16.99│ 12:00  │  40   │ Global│"
echo "└─────────────────────────────────────────────────────────────────────┘"
echo ""

TOKEN=$(curl -s -X POST http://localhost:9000/auth/user/emailpass -H "Content-Type: application/json" -d '{"email":"admin@medusa-test.com","password":"supersecret"}' | jq -r '.token')

echo "🧪 СЦЕНАРИЙ 1: Стандартный выбор (quantity: 2)"
RESULT=$(curl -s -X POST http://localhost:9000/custom/admin/suppliers -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"product_id":"pink-silicone-vibrator","quantity":2,"region_id":"eu"}')
SELECTED=$(echo "$RESULT" | jq -r '.selection.selected_supplier.name')
PRIORITY=$(echo "$RESULT" | jq -r '.selection.selected_supplier.priority')
COST=$(echo "$RESULT" | jq -r '.selection.selected_supplier.total_cost')
WITHIN=$(echo "$RESULT" | jq -r '.selection.selected_supplier.within_cutoff')
echo "✅ Выбран: $SELECTED (Priority: $PRIORITY, Cost: $$COST, Within cutoff: $WITHIN)"

echo ""
echo "📈 СЦЕНАРИЙ 2: Большой заказ (quantity: 15) - проверка stock availability"
RESULT2=$(curl -s -X POST http://localhost:9000/custom/admin/suppliers -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"product_id":"pink-silicone-vibrator","quantity":15,"region_id":"eu"}')
SELECTED2=$(echo "$RESULT2" | jq -r '.selection.selected_supplier.name // "Нет доступных"')
echo "✅ Выбран для 15 шт: $SELECTED2"

echo ""
echo "🚫 СЦЕНАРИЙ 3: Недостаточно товара (quantity: 50)"
RESULT3=$(curl -s -X POST http://localhost:9000/custom/admin/suppliers -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"product_id":"pink-silicone-vibrator","quantity":50,"region_id":"eu"}')
ERROR3=$(echo "$RESULT3" | jq -r '.error // "No error"')
echo "❌ Результат: $ERROR3"

echo ""
echo "🎯 КЛЮЧЕВЫЕ ПРАВИЛА ВЫБОРА:"
echo "┌─────────────────────────────────────────────────────────────────────┐"
echo "│ 1. ДОСТУПНОСТЬ СТОКА        │ stock_quantity >= запрошенное количество │"
echo "│ 2. CUT-OFF TIME             │ текущий_час < cut_off_time поставщика    │"
echo "│ 3. ПРИОРИТЕТ ПОСТАВЩИКА    │ 1 = самый высокий приоритет             │"
echo "│ 4. ОБЩАЯ СТОИМОСТЬ         │ (цена_товара × кол-во) + доставка       │"
echo "│ 5. ПРОДУКТ-ЛЕВЕЛ ОВЕРРАЙД │ priority_override в mapping              │"
echo "└─────────────────────────────────────────────────────────────────────┘"
