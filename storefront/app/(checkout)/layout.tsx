import { NavigationHeader } from '@/components/layout/NavigationHeader'

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationHeader />
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      {/* No footer in checkout for cleaner UX */}
    </div>
  )
}
