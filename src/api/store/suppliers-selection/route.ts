import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  res.json({
    message: "✅ SUPPLIER SELECTION API - Working via Store Routes!",
    info: "Когда товар доступен у нескольких поставщиков, система выбирает оптимального",
    available_suppliers: [
      {
        id: "supplier_001",
        name: "AdultToys Warehouse EU",
        priority: 1,
        cost_price: 1899, // $18.99
        shipping_cost: 599, // $5.99
        cut_off_time: "14:00",
        stock: 30,
        region: "EU"
      },
      {
        id: "supplier_002",
        name: "Lingerie Direct",
        priority: 2,
        cost_price: 2099, // $20.99
        shipping_cost: 499, // $4.99
        cut_off_time: "16:00",
        stock: 25,
        region: "EU"
      },
      {
        id: "supplier_003",
        name: "Global Adult Supply",
        priority: 3,
        cost_price: 1699, // $16.99
        shipping_cost: 899, // $8.99
        cut_off_time: "12:00",
        stock: 40,
        region: "Global"
      }
    ]
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { product_id, quantity } = req.body

  // Моковая логика выбора поставщика
  const suppliers = [
    {
      id: "supplier_001",
      name: "AdultToys Warehouse EU",
      priority: 1,
      cost_price: 1899,
      shipping_cost: 599,
      cut_off_time: "14:00",
      stock: 30
    },
    {
      id: "supplier_002",
      name: "Lingerie Direct",
      priority: 2,
      cost_price: 2099,
      shipping_cost: 499,
      cut_off_time: "16:00",
      stock: 25
    },
    {
      id: "supplier_003",
      name: "Global Adult Supply",
      priority: 3,
      cost_price: 1699,
      shipping_cost: 899,
      cut_off_time: "12:00",
      stock: 40
    }
  ]

  // Фильтр по наличию
  const available = suppliers.filter(s => s.stock >= quantity)

  if (available.length === 0) {
    return res.status(400).json({
      error: `Нет поставщиков с ${quantity} единицами на складе`,
      requested: quantity,
      available_suppliers: suppliers.map(s => ({ name: s.name, stock: s.stock }))
    })
  }

  // Проверка cut-off time (текущее время vs cut_off_time)
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const withinCutoff = available.filter(s => currentTime < s.cut_off_time)

  // Если никто не в cutoff, используем всех доступных
  const candidates = withinCutoff.length > 0 ? withinCutoff : available

  // Расчет total cost и выбор по priority
  const scored = candidates.map(s => ({
    ...s,
    total_cost: (s.cost_price * quantity) + s.shipping_cost,
    within_cutoff: currentTime < s.cut_off_time
  }))

  // Сортировка: priority (1=лучше), затем total_cost (меньше=лучше)
  const winner = scored.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority
    return a.total_cost - b.total_cost
  })[0]

  res.json({
    success: true,
    product_id,
    quantity,
    algorithm: "✅ Выбор поставщика из нескольких доступных",
    selection_criteria: [
      "1. Доступность на складе (stock_quantity >= quantity)",
      "2. Cut-off time для same-day delivery",
      "3. Priority поставщика (1 = самый высокий)",
      "4. Общая стоимость (цена товара + доставка)"
    ],
    selected_supplier: {
      id: winner.id,
      name: winner.name,
      priority: winner.priority,
      cost_breakdown: {
        product_cost: winner.cost_price * quantity,
        shipping_cost: winner.shipping_cost,
        total_cost: winner.total_cost
      },
      stock_available: winner.stock,
      within_cutoff: winner.within_cutoff,
      cut_off_time: winner.cut_off_time,
      current_time: currentTime
    },
    alternative_suppliers: scored.filter(s => s.id !== winner.id).map(s => ({
      name: s.name,
      priority: s.priority,
      total_cost: s.total_cost,
      within_cutoff: s.within_cutoff
    }))
  })
}
