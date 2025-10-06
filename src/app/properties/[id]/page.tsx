import PropertyDetail from '@/components/PropertyDetail'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Property Details - Rentora | Japan Real Estate for Foreigners',
  description: 'View detailed information about this property including photos, amenities, and contact information.',
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main className="min-h-screen">
      <Header />
      <PropertyDetail propertyId={id} />
      <Footer />
    </main>
  )
}