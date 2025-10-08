import ServicesContent from '@/components/ServicesContent'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Our Services - Rentora | Japan Real Estate for Foreigners',
  description: 'Comprehensive real estate services for foreigners in Japan. From property search to relocation support, we\'ve got you covered.',
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <ServicesContent />
      <Footer />
    </main>
  )
}