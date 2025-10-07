import WorkingContactForm from '@/components/WorkingContactForm'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Contact Us - Rentora | Japan Real Estate for Foreigners',
  description: 'Get in touch with our expert team for personalized real estate assistance. We speak your language and understand your needs.',
}

export default function ContactPageRoute() {
  return (
    <main className="min-h-screen">
      <Header />
      <WorkingContactForm />
      <Footer />
    </main>
  )
}