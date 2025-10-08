import ModernSearchInterface from '@/components/ModernSearchInterface'
import ModernHeader from '@/components/ModernHeader'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Properties - Rentora | Japan Real Estate for Foreigners',
  description: 'Browse our extensive collection of properties across Tokyo and other major Japanese cities. Find your perfect home in Japan.',
}

export default function PropertiesPage() {
  return (
    <main className="min-h-screen">
      <ModernHeader />
      <div className="pt-16">
        <div className="container-padding py-16">
          <ModernSearchInterface showFilters={true} showViewToggle={true} />
        </div>
      </div>
      <Footer />
    </main>
  )
}