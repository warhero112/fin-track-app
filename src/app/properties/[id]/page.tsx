import PropertyDetailPage from '@/components/PropertyDetailPage'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Property Details - Rentora | Japan Real Estate for Foreigners',
  description: 'View detailed information about this property including photos, amenities, and contact information.',
}

export default async function PropertyDetailPageRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Mock property data - in real app, fetch from API
  const property = {
    id,
    title: 'Modern Apartment in Shibuya',
    description: 'Beautiful modern apartment in the heart of Shibuya with excellent transportation access. This stunning 2LDK apartment features a spacious living area, modern kitchen, and private balcony with city views. Perfect for professionals working in central Tokyo.',
    price: 180000,
    priceType: 'rent' as const,
    address: '1-2-3 Shibuya, Shibuya-ku, Tokyo',
    ward: 'Shibuya-ku',
    city: 'Tokyo',
    prefecture: 'Tokyo',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
    ],
    layout: '2LDK',
    bedrooms: 2,
    bathrooms: 1,
    area: 45,
    size_sqm: 45,
    property_type: 'apartment',
    furnished: false,
    pets_allowed: true,
    has_balcony: true,
    has_tatami: false,
    nearest_station: 'Shibuya Station',
    walk_time_minutes: 5,
    deposit_amount: 360000,
    key_money: 180000,
    agent: {
      name: 'Yuki Tanaka',
      phone: '+81-3-1234-5678',
      email: 'yuki@rentora.jp',
      rating: 4.8,
      properties_sold: 156
    },
    availability_status: 'available' as const,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }

  return (
    <main className="min-h-screen">
      <Header />
      <PropertyDetailPage property={property} />
      <Footer />
    </main>
  )
}