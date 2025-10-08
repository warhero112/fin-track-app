import PropertyDetailPage from '@/components/PropertyDetailPage'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import propertyService from '@/services/PropertyService'

export const metadata = {
  title: 'Property Details - Rentora | Japan Real Estate for Foreigners',
  description: 'View detailed information about this property including photos, amenities, and contact information.',
}

export default async function PropertyDetailPageRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Load property data from service
  const property = await propertyService.getPropertyById(id)
  
  if (!property) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
            <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
            <a href="/properties" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
              Back to Properties
            </a>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <PropertyDetailPage property={property} />
      <Footer />
    </main>
  )
}