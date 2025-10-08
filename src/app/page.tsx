import ModernHero from '@/components/ModernHero'
import ModernSearchInterface from '@/components/ModernSearchInterface'
import ModernFeaturedProperties from '@/components/ModernFeaturedProperties'
import WhyChooseUs from '@/components/WhyChooseUs'
import Testimonials from '@/components/Testimonials'
import ContactSection from '@/components/ContactSection'
import ModernHeader from '@/components/ModernHeader'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <ModernHeader />
      <ModernHero />
      <div className="container-padding py-16">
        <ModernSearchInterface />
      </div>
      <ModernFeaturedProperties />
      <WhyChooseUs />
      <Testimonials />
      <ContactSection />
      <Footer />
    </main>
  )
}