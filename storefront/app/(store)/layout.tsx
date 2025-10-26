import { NavigationHeader } from '@/components/layout/NavigationHeader'
import { Footer } from '@/components/layout/Footer'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationHeader />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
