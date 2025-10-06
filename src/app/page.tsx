import Hero from '@/components/Hero'
import AdvancedPropertySearch from '@/components/AdvancedPropertySearch'
import FeaturedProperties from '@/components/FeaturedProperties'
import WhyChooseUs from '@/components/WhyChooseUs'
import Testimonials from '@/components/Testimonials'
import ContactSection from '@/components/ContactSection'
import MortgageCalculator from '@/components/MortgageCalculator'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <AdvancedPropertySearch />
      <FeaturedProperties />
      <MortgageCalculator />
      <WhyChooseUs />
      <Testimonials />
      <ContactSection />
      <Footer />
    </main>
  )
}