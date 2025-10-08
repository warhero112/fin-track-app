import AboutContent from '@/components/AboutContent'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'About Us - Rentora | Japan Real Estate for Foreigners',
  description: 'Learn about Rentora\'s mission to help foreigners find their perfect home in Japan. Our experienced team provides expert guidance and support.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <AboutContent />
      <Footer />
    </main>
  )
}