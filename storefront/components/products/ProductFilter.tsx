'use client'

export function ProductFilter() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        {/* TODO: Add price range slider */}
        <p className="text-sm text-gray-600">Price filter coming soon...</p>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        {/* TODO: Add category checkboxes */}
        <p className="text-sm text-gray-600">Category filter coming soon...</p>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Sort By</h3>
        {/* TODO: Add sort dropdown */}
        <p className="text-sm text-gray-600">Sort options coming soon...</p>
      </div>
    </div>
  )
}
