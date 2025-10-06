import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
})

export const metadata: Metadata = {
  title: 'Rentora - Japan Real Estate for Foreigners',
  description: 'Find your perfect home in Japan. Expert real estate services for foreigners with English support.',
  keywords: 'Japan real estate, Tokyo apartments, foreigner housing, Japan property, rental apartments',
  authors: [{ name: 'Rentora' }],
  openGraph: {
    title: 'Rentora - Japan Real Estate for Foreigners',
    description: 'Find your perfect home in Japan. Expert real estate services for foreigners with English support.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="font-sans antialiased">
        <UserProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </UserProvider>
      </body>
    </html>
  )
}