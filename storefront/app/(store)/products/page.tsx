export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar for filters - TODO: Add FilterSidebar component */}
        <aside className="lg:w-64">
          <div className="card p-4">
            <h2 className="font-semibold mb-4">Filters</h2>
            <p className="text-sm text-gray-600">Filters coming soon...</p>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* TODO: Add ProductGrid component here */}
          <p className="text-gray-600">Product grid will be displayed here...</p>
        </div>
      </div>
    </div>
  )
}
