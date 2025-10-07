import Hero from '@/components/Hero'
import WorkingPropertySearch from '@/components/WorkingPropertySearch'
import FeaturedProperties from '@/components/FeaturedProperties'
import WhyChooseUs from '@/components/WhyChooseUs'
import Testimonials from '@/components/Testimonials'
import ContactSection from '@/components/ContactSection'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <WorkingPropertySearch />
      <FeaturedProperties />
      <WhyChooseUs />
      <Testimonials />
      <ContactSection />
      <Footer />
    </main>
  )
}