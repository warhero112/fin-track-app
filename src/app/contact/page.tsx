import ModernContactForm from '@/components/ModernContactForm'
import ModernHeader from '@/components/ModernHeader'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Contact Us - Rentora | Japan Real Estate for Foreigners',
  description: 'Get in touch with our expert team for personalized real estate assistance. We speak your language and understand your needs.',
}

export default function ContactPageRoute() {
  return (
    <main className="min-h-screen">
      <ModernHeader />
      <div className="pt-16">
        <div className="container-padding py-20">
          <ModernContactForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}